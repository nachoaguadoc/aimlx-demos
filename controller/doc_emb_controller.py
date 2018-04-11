from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import re
import config as conf
from helpers import *
import requests
import pickle
import os

FL = 'flat'
ST = 'structured'

doc_emb_api = Blueprint('doc_emb_api', __name__)

@doc_emb_api.route('')
def getDE():
    return render_template('doc_emb/doc_emb.html')

@doc_emb_api.route('', methods=['POST'])
def submitDE():
    if request.method == 'POST':
        post_parameters = request.get_json(force=True)
        print("Demo DE:", post_parameters)
        for r in post_parameters:
            post_parameters[r] = str(post_parameters[r])
        result = requests.post(conf.doc_emb['url'], json=post_parameters)
        result_dict = result.json()
        url = result_dict['url']
        try:
            title = result_dict['title']
            category = result_dict['category']
            predictions = result_dict['predictions']
            list_kp = result_dict['list_kp']
            return render_template(url,
                                   title=title,
                                   category=category,
                                   flat_prediction=predictions[FL],
                                   structured_prediction=predictions[ST],
                                   flat_list_kp=list_kp[FL],
                                   structured_list_kp=list_kp[ST])
        except:
            return render_template(url)
