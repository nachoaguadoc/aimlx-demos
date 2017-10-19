from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import requests
import config as conf
import helpers

slot_filling_api = Blueprint('slot_filling_api', __name__)
    
@slot_filling_api.route('')
def getSlotfilling():
    return render_template('slotfilling/slotfilling.html')

@slot_filling_api.route('', methods=['POST'])
def submitSlotfilling():
    parameters = request.get_json(force=True)
    print("Demo slot filling:", parameters)
    if request.method == 'POST':
        result = requests.post(conf.slotfilling['url'], json=parameters)
        resultdict = result.json()

        return jsonify(resultdict)   