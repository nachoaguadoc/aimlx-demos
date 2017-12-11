from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory
import base64
import requests
import config as conf
import helpers
from . import emotion


@emotion.route('')
def index():
    return render_template('emotion.html')

@emotion.route('', methods=['POST'])
def submitCapture():
    parameters = request.get_json(force=True)
    image_url = parameters['image'].encode('utf-8')
    image_path =  conf.emotion["img_path"] + "temp.jpeg"
    fh = open(image_path, "wb")
    fh.write(base64.b64decode(image_url))
    fh.close()
    request_json = {'image_path': image_path}
    answer_path = requests.post(conf.emotion["url"], json=request_json).json()
    print('***************')
    print('answer_path', answer_path)
    print('***************')
    return jsonify(answer_path)
