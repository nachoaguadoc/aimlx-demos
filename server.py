import re
import select
import socket
import subprocess
import sys
from multiprocessing import Value
import json
import base64
import requests

from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request, send_from_directory
from flask_cors import CORS
from flask_scss import Scss

import json
import config as conf
import jsonpickle
import helpers

from controller.chatbot_controller import chatbot_api
from controller.churn_controller import churn_api
from controller.argumentation_controller import argumentation_api
from controller.kp_extraction_controller import kp_extraction_api
from controller.machine_translation_controller import machine_translation_api
from controller.gsw_controller import gsw_api
#from controller.ner_controller import ner_api
from controller.neural_programmer_controller import neural_programmer_api
from controller.opinion_target_controller import opinion_target_api
from controller.sfid_controller import sfid_api
from controller.slot_filling_controller import slot_filling_api
from controller.seq2sql_controller import seq2sql_api
from controller.sid_controller import sid_api

from sfid import sfid
from argumentation import argumentation
from summarization import summarization
from tweet_label import tweet_label
from grocery import grocery
from emotion import emotion
from go_chatbot import go_chatbot
from material import material
from chestxray import chestxray
from sid import sid
from data_selection import data_selection

app = Flask(__name__)
CORS(app)
Scss(app, static_dir='static/ui-kit/custom/css', asset_dir='static/ui-kit/custom/scss')


app.register_blueprint(seq2sql_api, url_prefix='/seq2sql')
app.register_blueprint(chatbot_api, url_prefix='/chatbot')
app.register_blueprint(neural_programmer_api, url_prefix='/neural_programmer')
app.register_blueprint(opinion_target_api, url_prefix='/opinion')
app.register_blueprint(churn_api, url_prefix='/churn')
#app.register_blueprint(ner_api, url_prefix='/ner')
app.register_blueprint(kp_extraction_api, url_prefix='/kp')
app.register_blueprint(machine_translation_api, url_prefix='/translate')
app.register_blueprint(gsw_api, url_prefix='/gsw')
app.register_blueprint(argumentation, url_prefix='/argumentation')
app.register_blueprint(tweet_label, url_prefix='/tweet_label')
app.register_blueprint(slot_filling_api, url_prefix='/slotfilling')

app.register_blueprint(sfid, url_prefix='/sfid')
app.register_blueprint(go_chatbot, url_prefix='/go_chatbot')
app.register_blueprint(summarization, url_prefix='/summarization')
app.register_blueprint(sfid_api, url_prefix='/sfid_old')
app.register_blueprint(grocery, url_prefix='/grocery')
app.register_blueprint(emotion, url_prefix='/emotion')

app.register_blueprint(material, url_prefix='/material')
app.register_blueprint(chestxray, url_prefix='/chestxray')
app.register_blueprint(data_selection, url_prefix='/data_selection')

app.register_blueprint(sid, url_prefix='/sid')


@app.route('/')
def getIndex():
    return render_template('index.html')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html'), 404


if __name__ == '__main__':
    app.run(host='127.0.0.1')
    
