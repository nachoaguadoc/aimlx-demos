from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import socket
import config as conf
import helpers

churn_api = Blueprint('churn_api', __name__)

@churn_api.route('/')
def getChurn():
    return render_template('churn/churn.html')

@churn_api.route('/', methods=['POST'])
def submitChurn():
    parameters = request.get_json(force=True)
    print("Demo Churn:", parameters)
    tweet = parameters['input']
    # learning_type = request.get_json(force=True)["learning"]
    port = conf.churn['e_port']
    ip = conf.churn['e_host']
    if request.method == 'POST':
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        server_address = (ip, port)
        try:
            print('sending "%s"' % tweet)
            sent = sock.sendto(tweet.encode(), server_address)
            print('waiting to receive')
            data, server = sock.recvfrom(4096)
            answer = {'answer': data.decode()}
            print(data.decode())
        finally:
            sock.close()
        return jsonify(answer)