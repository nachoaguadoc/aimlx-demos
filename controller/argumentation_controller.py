from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import requests
import config as conf
import helpers

argumentation_api = Blueprint('argumentation_api', __name__)

@argumentation_api.route('')
def getArgumentation():
    return render_template('argumentation/argumentation.html')
    

@argumentation_api.route('', methods=['POST'])
def submitArgumentation():
    parameters = request.get_json(force=True)
    print("Demo argumentation:", parameters)
    if request.method == 'POST':
        result = requests.post(conf.argumentation['url'], json=parameters)
        resultdict = result.json()
        return jsonify(resultdict)