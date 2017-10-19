from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import config as conf
import helpers

sfid_api = Blueprint('sfid_api', __name__)

@sfid_api.route('/')
def getSFID():
    return render_template('sfid/sfid.html')

@sfid_api.route('/', methods=['POST'])
def submitSFID():
    parameters = request.get_json(force=True)
    print("Demo slot filling and intent detection:", parameters)
    if request.method == 'POST':
        result = requests.post(conf.sfid['url'], json=parameters)
        resultdict = result.json()
        return jsonify(resultdict)