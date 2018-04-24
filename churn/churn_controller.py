from flask import request, render_template, session
import requests
import config as conf
from . import churn
import json


@churn.route('')
def getChurn():
    return render_template('churn.html')


@churn.route('', methods=['POST'])
def submitChrun():
    parameters = request.get_json(force=True)
    print("Demo churn:", parameters)
    if request.method == 'POST':

        text = parameters['input'].lower()
        label_answer = None

        # 1. Check if still labels to do = answer is related to churn/non churn
        if 'churn' in session and len(session['churn']) != 0:
            # Compose msg to update db
            label_answer = send_label(session['text'], session['lang'], session['churn'][-1][0], session['churn'][-1][1], text)
            session['churn'] = session['churn'][:-1]
        else:
            result = send_request(text)
            if result is None:
                return json.dumps({'msg': 0, 'lang': 'EN'})

            session['text'] = parameters['input']
            session['lang'] = result['lang']
            session['churn'] = result['churn']

        # 2. Check if all brand labeled
        if len(session['churn']) != 0:
            # 2.a. There are still brands to label -> send result for new tweet
            data_msg = {'lang': session['lang'], 'brand': session['churn'][-1][0], 'label': session['churn'][-1][1]}
        else:
            # 2.b. It was the last one. Wat for new entry
            data_msg = {'msg': 1, 'lang': session['lang']}

        # 3. Add answer to previous label if available
        if label_answer is not None:
            data_msg['label_answer'] = label_answer

        return json.dumps(data_msg)


def send_request(text):
    try:
        data = json.dumps({'text': text.lower()})
        print(data)
        response = requests.post(conf.churn['api_url'] + 'process', data=data)
        return json.loads(response.text)
    except Exception as e:
        print('Error:', e)
        return None


def send_label(text, lang, brand, label, cgt):
    try:
        data = {'text': text, 'lang': lang, 'brand': brand, 'label': label, 'cgt': cgt}
        result = requests.post(conf.churn['api_url'] + 'churn_label', data=json.dumps(data))
        result = json.loads(result.text)
        if result is not None and 'correct' in result:
            print('Answer was :', result['correct'])
            return result['correct']
        else:
            return None
    except Exception as e:
        print('Error:', e)
    return None
