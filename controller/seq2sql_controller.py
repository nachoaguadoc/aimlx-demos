from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import socket
import config as conf
import helpers

seq2sql_api = Blueprint('seq2sql_api', __name__)


# Chatbot route handling
@seq2sql_api.route('/')
def getSeq2SQL():
    return render_template('seq2sql/seq2sql.html')

@seq2sql_api.route('', methods=['POST'])
def submitSeq2SQL():
    parameters = request.get_json(force=True)
    print("Demo SEQ2SQL:", parameters)
    if request.method == 'POST':
        socket_address = conf.seq2sql['socket_address']
        socket_port = conf.seq2sql['socket_port']
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((socket_address, socket_port))
        msg = parameters['question']
        print(msg)
        s.sendall(msg.encode())
        answer = s.recv(2048).decode("utf-8")
        print("Question {} --- Answer: {}".format(msg, answer))
        s.close()
        return jsonify({'seq2sql': answer})
