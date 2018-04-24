from flask import request, render_template
import requests
import config as conf
from . import churn
import json


@churn.route('')
def getChurn():
    return render_template('churn.html')


@churn.route('/get_prediction', methods=['POST'])
def get_prediction():
    try:
        parameters = request.get_json(force=True)
        print("New prediction for:", parameters)
        response = requests.post(conf.churn['api_url'] + 'process',
                                 data=json.dumps({'text': parameters['input'].lower()}))
        return response.text
    except Exception as e:
        print('Error:', e)
        return None


@churn.route('/send_label', methods=['POST'])
def send_label():

    try:
        parameters = request.get_json(force=True)
        print("New label received:", parameters)

        data = {'text': parameters['text'], 'lang': parameters['lang'],
                'brand': parameters['brand'], 'label': parameters['label']}
        print(data)
        requests.post(conf.churn['api_url'] + 'churn_label', data=json.dumps(data))
    except Exception as e:
        print('Error:', e)

    return ''
