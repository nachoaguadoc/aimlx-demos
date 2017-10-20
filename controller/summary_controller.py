from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import select
import sys
import socket
import config as conf
import helpers

summary_api = Blueprint('summary_api', __name__)
def encode_sth(item):
    coding = ['iso-8859-1', 'utf8', 'latin1', 'ascii']
    for coding_format in coding:
        try:
            coded = item.encode(coding_format)
            return coded
        except:
            continue
    raise Exception('Unable to encode', item)


def decode_sth(item):
    coding = ['iso-8859-1', 'utf8', 'latin1', 'ascii']
    for coding_format in coding:
        try:
            coded = item.decode(coding_format)
            return coded
        except:
            continue
    raise Exception('Unable to decode', item)
@summary_api.route('')
def getSummary():
    return getSummaryURL()


@summary_api.route('', methods=['POST'])
def submitSummary():
    return submitSummary()


@summary_api.route('/url')
def getSummaryURL():
    return render_template('summary/summary_url.html')


@summary_api.route('/url', methods=['POST'])
def submitSummaryURL():
    input = request.get_json(force=True)['inp_url']
    model_type = request.get_json(force=True)['model_type']
    url = input.rstrip('\n')
    if request.method == 'POST':
        if model_type == 'extractive':
            host = conf.summary['e_host']
            port = conf.summary['e_port']
        elif model_type == 'abstractive':
            host = conf.summary['a_host']
            port = conf.summary['a_port']
        elif model_type == 'mixed':
            host = conf.summary['m_host']
            port = conf.summary['m_port']
        else:
            return jsonify({'text': 'Unrecognized model_type: %s' % model_type,
                            'summary': 'Unrecognized model_type: %s' % model_type})

        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.settimeout(2)

        try:
            client.connect((host, port))
            print('Socket established on %s:%d!' % (host, port))
        except:
            return jsonify({'text': 'Unable to connect the server', 'summary': 'Unable to connect the server'})

        socket_list = [client, sys.stdin]
        client.send(encode_sth(url))

        print('Start analyzing %s' % url)
        while True:
            ready2read, ready2write, in_err = select.select(socket_list, [], [])
            for sock in ready2read:
                if sock == client:
                    response = decode_sth(sock.recv(65536))
                    if not response:
                        return jsonify(
                            {'text': 'Unable to connect the server', 'summary': 'Unable to connect the server'})
                    else:
                        parts = response.split('@@@@@')
                        if len(parts) == 1:
                            return jsonify({'text': parts[0], 'summary': parts[0]})
                        else:
                            return jsonify({'text': parts[0], 'summary': parts[1]})

