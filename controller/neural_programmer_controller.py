from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import socket
import config as conf
import helpers
from pymongo import MongoClient

neural_programmer_api = Blueprint('neural_programmer_api', __name__)


if (conf.neural_programmer['mongo']):
    client = MongoClient(conf.neural_programmer['mongo_address'], conf.neural_programmer['mongo_port'], connect=False)
    db = client[conf.neural_programmer['mongo_db']]
    feedback_coll = db[conf.neural_programmer['mongo_feedback_coll']]
    use_coll = db[conf.neural_programmer['mongo_use_coll']]

# Chatbot route handling
@neural_programmer_api.route('')
def getLandingNeuralProgrammer():
    return render_template('neural_programmer/neural_programmer_landing.html')


# Chatbot route handling
@neural_programmer_api.route('/<demo>')
def getNeuralProgrammer(demo):
    if demo == '':
        return render_template('neural_programmer/neural_programmer_landing.html')
    elif demo == 'football':
        return render_template('neural_programmer/neural_programmer_football.html')
    elif demo == 'swisscom':
        return render_template('neural_programmer/neural_programmer_swisscom.html')
    elif demo == 'tutorial':
        return render_template('neural_programmer/neural_programmer_tutorial.html')
    elif demo == 'steps':
        return render_template('neural_programmer/neural_programmer_steps.html')
    elif demo == "simple":
        return render_template('neural_programmer/neural_programmer_simple.html')


@neural_programmer_api.route('/<demo>', methods=['POST'])
def submitNeuralProgrammer(demo):
    parameters = request.get_json(force=True)
    print("Demo Neural Programmer:", parameters)
    if (demo == "feedback"):
        print("Feedback received")
        feedback_id = feedback_coll.insert_one(parameters).inserted_id
        print("Debug:", parameters)
        print("ID:", feedback_id)
        answer = "Feedback " + str(feedback_id) + " sent!"
        return jsonify({'answer': answer})

    elif (demo == "demo_question"):
        tokens = parameters['question']
        table_key = parameters['table_key']
        print("Question:", tokens, "Table:", table_key)
        if request.method == 'POST':
            socket_address = conf.neural_programmer['socket_address']
            socket_port = conf.neural_programmer['socket_port']
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((socket_address, socket_port))
            msg = table_key + '****----****' + tokens
            s.sendall(msg.encode())
            answer = s.recv(2048).decode("utf-8")
            s.close()
            return jsonify({'neural_programmer': answer})

    elif (demo == "question"):
        tokens = parameters['question']
        table_key = parameters['table_key']
        user_id = parameters['user_id']
        timestamp = parameters['timestamp']
        question_id = parameters['question_id']
        demo = parameters['demo']

        info = {"question": tokens, "table_key": table_key, "user_id": user_id, "timestamp": timestamp, "demo": demo,
                "question_id": question_id}
        if conf.neural_programmer['mongo']:
            feedback_id = use_coll.insert_one(info).inserted_id
        print("Question ID", question_id, "with text", tokens, "about table", table_key, "from user", user_id,
              "using the", demo, "demo")
        #print("Question stored:", feedback_id)

        if request.method == 'POST':
            socket_address = conf.neural_programmer['socket_address']
            socket_port = conf.neural_programmer['socket_port']
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((socket_address, socket_port))
            msg = table_key + '****----****' + tokens
            s.sendall(msg.encode())
            answer = s.recv(2048).decode("utf-8")
            s.close()
            return jsonify({'neural_programmer': answer})
