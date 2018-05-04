from flask import request, render_template, make_response, redirect, url_for
import requests
import config as conf
from . import churn
import json


@churn.route('')
def getChurn():

    t = request.cookies.get('tutorial')
    if t is not None:
        return render_template('churn.html')
    else:
        return redirect(url_for('churn.churn_description'))

        # resp = make_response(render_template('churn.html'))
        # resp.set_cookie('username', 'the username')
        # return resp


@churn.route('/description')
def churn_description():
    t = request.cookies.get('tutorial')
    return render_template('churn_description.html', t=t)


@churn.route('/examples')
def churn_examples():
    return render_template('churn_doit.html')


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
