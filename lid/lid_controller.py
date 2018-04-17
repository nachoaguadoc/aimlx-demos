from flask import jsonify, request, render_template, send_from_directory, Response
import requests
import config as conf
from . import lid
import os


@lid.route('')
def showSidPage():
    return send_from_directory('lid', 'index.html')


@lid.route('/identify', methods=['POST'])
def identify():
    print('identify')
    if request.method == 'POST':
        identify_url = os.path.join(conf.lid['url'], "LIDidentify")
        resp = requests.request(method=request.method, url=identify_url, headers={key: value for (key, value) in request.headers if key != 'Host'}, data=request.get_data(), cookies=request.cookies, allow_redirects=False)

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

        response = Response(resp.content, resp.status_code, headers)
        return response


@lid.route('/<path:path>', methods=['GET'])
def send_js(path):
    print("PATH:")
    print(path)
    return send_from_directory('lid', path)
