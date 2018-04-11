from __future__ import absolute_import
from flask import Flask, jsonify, request, render_template
from . import multilingual


@multilingual.route('')
def index():
    return render_template('index.html')


@multilingual.route('/alldocs', methods=['GET', 'POST'])
def process_all_doc():
    return render_template('multilingual_sample_docs.html')


@multilingual.route('/sendalldocs', methods=['GET', 'POST'])
def process_send_all_doc():
    return render_template('multilingual_sample_docs.html')


@multilingual.route('/choosedoc', methods=['GET', 'POST'])
def process_choose_doc():
    return render_template('multilingual_choose_doc.html')