from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import json
import socket
import config as conf
import helpers
import subprocess

chatbot_api = Blueprint('chatbot_api', __name__)

socket_goal_chatbot = None

# Chatbot route handling
@chatbot_api.route('/<demo>')
def getChatbot(demo):
    if demo == 'ubuntu':
        return render_template('chatbot_ubuntu/chatbot_ubuntu.html')
    elif demo == 'swisscom':
        return render_template('chatbot_swisscom/chatbot_swisscom.html')
    elif demo == 'ubuntuseq2seq':
        return render_template('chatbot_ubuntu/chatbot_seq2seq_ubuntu.html')
    elif demo == 'goaloriented':
        global socket_goal_chatbot
        socket_address = conf.chatbot_goaloriented['socket_address']
        socket_port = conf.chatbot_goaloriented['socket_port']
        socket_goal_chatbot = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket_goal_chatbot.connect((socket_address, socket_port))
        user_goal = json.loads(socket_goal_chatbot.recv(1024).decode("utf-8"))
        return render_template('chatbot_goaloriented/chatbot_goaloriented.html', request_slots=user_goal['request_slots'], inform_slots=user_goal['inform_slots'])


@chatbot_api.route('/<demo>', methods=['POST'])
def submitChatbot(demo):
    parameters = request.get_json(force=True)
    print("Demos Chatbot:", parameters)
    question = parameters['question']
    print("Question:", question)
    if request.method == 'POST':
        if demo == 'ubuntu':
            predict_dir = conf.chatbot_ubuntu['path']
            model_id = conf.chatbot_ubuntu['model_id']
            python_env = conf.chatbot_ubuntu['python_env']
        elif demo == 'swisscom':
            predict_dir = conf.chatbot_swisscom['path']
            model_id = conf.chatbot_swisscom['model_id']
            python_env = conf.chatbot_swisscom['python_env']
        elif demo == 'ubuntuseq2seq':
            socket_address = conf.chatbot_ubuntu_seq2seq['socket_address']
            socket_port = conf.chatbot_ubuntu_seq2seq['socket_port']
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((socket_address, socket_port))
            s.sendall(question.encode())
            answer = s.recv(2048).decode("utf-8")
            s.close()
            return jsonify({'seq2seq': answer})
        elif demo == 'goaloriented':
            global socket_goal_chatbot
            socket_goal_chatbot.sendall(question.encode())
            answer = socket_goal_chatbot.recv(1024).decode("utf-8")
            return jsonify({'chatbot_reply': answer})

        model_dir = predict_dir + 'runs/' + model_id
        subprocess.call([python_env, predict_dir + 'demo_prediction.py', '--model_dir=' + model_dir,
                         '--raw_query=' + "'" + question + "'"])
        # Generate answer here
        with open(predict_dir + "answers.txt", "r") as text_file:
            answer = text_file.readlines()[0]
        answer = answer.split('___|||___')
        encoder = answer[0].split('___***___');
        solr = answer[1].split('___***___');
        encoder = answer[0].split('___***___');
        answer = {'solr': solr, 'encoder': encoder}
        return jsonify(answer)
