from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import config as conf
import helpers

opinion_target_api = Blueprint('opinion_target_api', __name__)

@opinion_target_api.route('/')
def getOpinion():
    return render_template('opinion_target/opinion_target.html')


@opinion_target_api.route('/', methods=['POST'])
def submitOpinion():
    parameters = request.get_json(force=True)
    print("Demo Opinion:", parameters)
    input = parameters['input']
    learning_type = request.get_json(force=True)["learning"]
    if request.method == 'POST':
        if learning_type == "supervised":
            script_dir = conf.ate['path'] + 'run_demo.py'
            predict_dir = conf.ate['path'] + 'predictions/predictions.txt'
            python_env = conf.ate['python_env']
            response = ""
            subprocess.call([python_env, script_dir, '--sentence', '"' + input + '"'])
            answer = parse_output(predict_dir)
            print("Question received for ATE project", answer)
            answer = {'labels': answer}
            return jsonify(answer)
        else:
            script_dir = conf.unsupervisedate['path'] + 'run_demo.py'
            predict_dir = conf.unsupervisedate['path'] + 'predictions/predictions.txt'
            python_env = conf.unsupervisedate['python_env']
            response = ""
            subprocess.call([python_env, script_dir, '--sentence', '"' + input + '"'])
            answer = parse_output(predict_dir)
            print("Question received for ATE project", answer)
            answer = {'labels': answer}
            return jsonify(answer)