from flask import jsonify, request, render_template, send_from_directory, Response
import requests
import config as conf
from . import speech_emotion
import os


@speech_emotion.route('')
def showSidPage():
    return send_from_directory('speech_emotion', 'index.html')


@speech_emotion.route('/identify', methods=['POST'])
def identify():
    if request.method == 'POST':
        identify_url = os.path.join(conf.speech_emotion['url'], "identify")
        resp = requests.request(method=request.method, url=identify_url, headers={key: value for (key, value) in request.headers if key != 'Host'}, data=request.get_data(), cookies=request.cookies, allow_redirects=False)

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

        response = Response(resp.content, resp.status_code, headers)
        return response

@speech_emotion.route('/record', methods=['POST'])
def identify():
    if request.method == 'POST':
        record_url = os.path.join(conf.speech_emotion['url'], "record")
        resp = requests.request(method=request.method, url=record_url, headers={key: value for (key, value) in request.headers if key != 'Host'}, data=request.get_data(), cookies=request.cookies, allow_redirects=False)

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

        response = Response(resp.content, resp.status_code, headers)
        return response

@speech_emotion.route('/<path:path>', methods=['GET'])
def send_js(path):
    print("PATH:")
    print(path)
    return send_from_directory('speech_emotion', path)
