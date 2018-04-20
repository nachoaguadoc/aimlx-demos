from __future__ import absolute_import
from flask import Flask, jsonify, request, render_template
import requests
import config as conf
from . import multilingual

@multilingual.route('')
def index():
    return render_template('multilingual_index.html')


@multilingual.route('/alldocs', methods=['GET', 'POST'])
def process_all_doc():
    return render_template('multilingual_sample_docs.html')


@multilingual.route('/sendalldocs', methods=['GET', 'POST'])
def process_send_all_doc():
    return render_template('multilingual_sample_docs.html')


@multilingual.route('/choosedoc', methods=['GET', 'POST'])
def process_choose_doc():
    return render_template('multilingual_choose_doc.html')


@multilingual.route('/sendchoosedoc', methods=['GET', 'POST'])
def process_send_choose_doc():
    parameters = request.get_json(force=True)
    if request.method == 'POST':
        result = requests.post(conf.multilingual['url'], json=parameters)
        resultdict = result.json()
        return jsonify(resultdict)


