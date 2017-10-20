from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import subprocess
import config as conf
import helpers

ner_api = Blueprint('ner_api', __name__)

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


def parse_input(input, file):
    f = open(file, "w")
    tokens = [token for token in input.split()]
    for token in tokens:
        f.write(token + " O\n")

# NER route handling
@ner_api.route('')
def getNER():
    return render_template('ner/ner.html')


@ner_api.route('', methods=['POST'])
def submitNER():
    parameters = request.get_json(force=True)
    print("Demo NER:", parameters)
    input = parameters['input']
    if request.method == 'POST':
        script_dir = conf.ner['path'] + 'run_demo.py'
        predict_dir = conf.ner['path'] + 'predictions/predictions.txt'
        python_env = conf.ner['python_env']
        response = ""
        subprocess.call([python_env, script_dir, '--sentence', '"' + input + '"'])
        answer = parse_output(predict_dir)
        print("Question received for NER project", answer)
        answer = {'labels': answer}
        return jsonify(answer)
