from typing import Optional

import requests
from flask import Blueprint
from flask import jsonify
from flask import render_template
from flask import request

import config as conf

ner_api = Blueprint('ner_api', __name__)

NER_ENDPOINT_MOLD = 'http://127.0.0.1:{}/compute/'
MODEL_PORTS = {
    'en': int(conf.ner['en_model_port']),
    'it': int(conf.ner['it_model_port']),
    'fr': int(conf.ner['fr_model_port']),
    'de': int(conf.ner['de_model_port'])
}


# Opinion target route handling
def parse_output(output_path):
    f = open(output_path, 'r')
    pred_labels = []
    for line in f:
        line = line.strip()
        if len(line.split()) == 3:
            pred_label = line.split()[2]
            pred_labels.append(pred_label)
    return " ".join(pred_labels)


# NER route handling
@ner_api.route('')
def getNER():
    return render_template('ner/ner.html')


def _get_language(input: str) -> Optional[str]:
    """
    Calls the AIKO api to detect the language of the input text.
    :param input:
    :return:
    """
    headers = {
        'Accept': 'application/vnd.sca.langdetect.v1+json',
        'Content-Type': 'application/json',
        'AI-Enabler-Tenant': conf.ner['aiko_tenant'],
        'Authorization': conf.ner['aiko_token']
    }
    body = {'text': input}
    r = requests.post(conf.ner['aiko_langdetect_endpoint'], headers=headers, json=body)
    if not r.ok:
        message = ('ERROR: AIKO language detect did not answer. Response code: "{r.status_code}"; ' +
                   'Response body: "{}"').format(r.status_code, r.raw)
        raise SystemError(message)
    return r.json()['language']


def _get_endpoint(language: str) -> str:
    """
    There are 4 docker container listening to 4 different ports, one per language.
    This function returns the right port number for the input language.
    See the initialization script for more info.
    :param language:
    :return:
    """
    if language not in MODEL_PORTS:
        raise ValueError('unknown language: "{}"'.format(language))
    return NER_ENDPOINT_MOLD.format(MODEL_PORTS[language])


def _get_predictions(model_endpoint: str, input_text: str, use_gazetteers: bool = True):
    """
    Asks the container pointed by model_endpoint for predictions.
    :param model_endpoint:
    :param input_text:
    :param use_gazetteers:
    :return:
    """
    headers = {'Content-Type': 'application/json'}
    body = {
        'text': input_text
    }
    r = requests.post(model_endpoint, headers=headers, json=body)
    if not r.ok:
        message = 'Something went wrong: the docker container {} did not answer'.format(model_endpoint)
        raise SystemError(message)
    return r.json()


@ner_api.route('', methods=['POST'])
def submitNER():
    parameters = request.get_json(force=True)
    print("Demo NER:", parameters)
    txt = parameters['input']
    if request.method == 'POST':
        try:
            language = _get_language(txt)
            model_endpoint = _get_endpoint(language)
            annotations = _get_predictions(model_endpoint, txt, use_gazetteers=True)
            return jsonify(annotations)
        except Exception as e:
            print(e)
