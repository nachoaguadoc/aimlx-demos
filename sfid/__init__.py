from flask import Blueprint, jsonify, request, render_template
import requests
import config as conf

sfid = Blueprint('sfid', __name__, template_folder='templates', static_folder='static')


@sfid.route('')
def showSfidPage():
    return render_template('sfid.html')


@sfid.route('', methods=['POST'])
def submitSfid():
    parameters = request.get_json(force=True)
    if request.method == 'POST':
        result = requests.post(conf.sfid['url'], json=parameters)
        resultdict = result.json()
        return jsonify(resultdict)
