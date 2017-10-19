from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request,send_from_directory

import config as conf
import helpers

gsw_api = Blueprint('gsw_api', __name__)

def _translate_helper(text, oov_method):
    data = {'text': text}
    if oov_method == 'pbsmt_ortho':
        r = requests.post(conf.gsw_translator['pbsmt_ortho_url'], json=data)
    elif oov_method == 'pbsmt_phono':
        r = requests.post(conf.gsw_translator['pbsmt_phono_url'], json=data)
    elif oov_method == 'pbsmt_cbnmt':
        r = requests.post(conf.gsw_translator['pbsmt_cbnmt_url'], json=data)
    else:
        print('asking the service')
        r = requests.post(conf.gsw_translator['pbsmt_only_url'], json=data)
    return r.json()
    
@gsw_api.route('/')
def get_gsw2de():
    return render_template('gsw/gswjs.html')


@gsw_api.route('/', methods=['POST'])
def submit_gsw2de():
    if request.method == 'POST':
        post_parameters = request.get_json(force=True)
        print("Demo GSW:", post_parameters)
        text = post_parameters['text']
        oov_method = post_parameters['oov_method']
        json_result = _translate_helper(text, oov_method)
        return jsonify(json_result)