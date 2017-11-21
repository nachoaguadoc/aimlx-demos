from flask import jsonify, request, render_template
import requests
import config as conf
from . import summarization


@summarization.route('')
def showSfidPage():
    return render_template('sfid.html')


@summarization.route('', methods=['POST'])
def submitSummarization():
    parameters = request.get_json(force=True)
    if request.method == 'POST':
        result = requests.post(conf.summarization['url'], json=parameters)
        resultdict = result.json()
        return jsonify(resultdict)
