from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import config as conf
import helpers

emotion_api = Blueprint('emotion_api', __name__)

@emotion_api.route('/')
def index():
    return render_template('/emotion/emotions.html')

@emotion_api.route('/', methods=['POST'])
def submitCapture():
    parameters = request.get_json(force=True)
    image_url = parameters['image'].encode('utf-8')
    image_path =  conf.emotions["img_path"] + "temp.jpeg"
    fh = open(image_path, "wb")
    fh.write(base64.b64decode(image_url))
    fh.close()
    request_json = {'image_path': image_path}
    answer_path = requests.post(conf.emotions["url"], json=request_json).json()
    print(answer_path)
    return jsonify(answer_path)