from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import re
import config as conf
from helpers import *
import requests

def read_file(path):
    with open(path, 'r') as f:
        return f.read()


def write_file(path, s):
    with open(path, 'w') as f:
        f.write(s)


def post_process(processed_text):
    processed_text = re.sub('\n+', '\n', processed_text)  # Multiple jumplines into 1 jumpline
    html_doc = processed_text.replace('\n', '</div><div class=start></br>')
    html_doc = html_doc.replace('<phrase>', '<span class=kp>')
    html_doc = html_doc.replace('</phrase>', '</span>')
    html_doc = '<div class=start>' + html_doc + '</div>'

    return html_doc

kp_extraction_api = Blueprint('kp_extraction_api', __name__)

# KP Extraction route handling
@kp_extraction_api.route('')
def getKP():
    return render_template('kp_extraction/kp_extraction.html')


@kp_extraction_api.route('', methods=['POST'])
def submitKP():
    if request.method == 'POST':
        post_parameters = request.get_json(force=True)
        print("Demo KP:", post_parameters)
        for r in post_parameters:
            post_parameters[r] = str(post_parameters[r])
        result = requests.post(conf.kpextract['api_url'], json=post_parameters)
        result_dict = result.json()
        return render_template('kp_extraction/kpboard.html', html_doc=post_process(result_dict['processed_text']),
                               list_kp=result_dict['list_kp'])


@kp_extraction_api.route('/api', methods=['POST'])
def submitKP_API():
    if request.method == 'POST':
        post_parameters = request.get_json(force=True)
        print("Demo KP:", post_parameters)
        for r in post_parameters:
            post_parameters[r] = str(post_parameters[r])
        if 'window_size' not in post_parameters:
            post_parameters['window_size'] = '5'
        if 'ilp' not in post_parameters:
            post_parameters['ilp'] = 'true'
        result = requests.post(conf.kpextract['api_url'], json=post_parameters)
        return jsonify(result.json())

@kp_extraction_api.route('/emb')
def getKP_emb():
    return render_template('kp_extraction/kp_extraction_emb.html')

@kp_extraction_api.route('/emb', methods=['POST'])
def submitKP_emb():
    if request.method == 'POST':
        post_parameters = request.get_json(force=True)
        print('Demo KP embedding', post_parameters)
        for r in post_parameters:
            post_parameters[r] = str(post_parameters[r])
        result = requests.post(conf.kpextract['api_emb_url'], json=post_parameters)
        print("***************_________")
        result_dict = result.json()
        process_api_result = []

        for e in result_dict['api_result']:
            e['relevance'] = round(e['relevance'] * 100)
            process_api_result.append(e)

        process_api_result = sorted(process_api_result, key=lambda k: k['relevance'], reverse=True)

        return render_template('kp_extraction/kpboard_emb.html', html_doc=post_process(result_dict['processed_text']),
                               list_kp=process_api_result)
