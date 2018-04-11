from flask import jsonify, request, render_template, send_from_directory, Response
import requests
import config as conf
from . import sid
import os


@sid.route('')
def showSidPage():
    return send_from_directory('sid', 'index.html')


@sid.route('/identify', methods=['POST'])
def identify():
    if request.method == 'POST':
        identify_url = os.path.join(conf.sid['url'], "identify")
        resp = requests.request(method=request.method, url=identify_url, headers={key: value for (key, value) in request.headers if key != 'Host'}, data=request.get_data(), cookies=request.cookies, allow_redirects=False)

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

        response = Response(resp.content, resp.status_code, headers)
        return response

@sid.route('/enroll', methods=['POST'])
def enroll():
    if request.method == 'POST':
        identify_url = os.path.join(conf.sid['url'], "enroll")
        resp = requests.request(method=request.method, url=identify_url, headers={key: value for (key, value) in request.headers if key != 'Host'}, data=request.get_data(), cookies=request.cookies, allow_redirects=False)

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

        response = Response(resp.content, resp.status_code, headers)
        return response

@sid.route('/list_enroll', methods=['GET'])
def list_enroll():
    if request.method == 'GET':
        identify_url = os.path.join(conf.sid['url'], "list_enroll")
        resp = requests.request(method=request.method, url=identify_url, headers={key: value for (key, value) in request.headers if key != 'Host'}, data=request.get_data(), cookies=request.cookies, allow_redirects=False)

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

        response = Response(resp.content, resp.status_code, headers)
        return response

@sid.route('/<path:path>', methods=['GET'])
def send_js(path):
    print("PATH:")
    print(path)
    return send_from_directory('sid', path)
