from flask import jsonify, request, render_template
import requests
import config as conf
from . import summarization


@summarization.route('')
def showSummarizationPage():
    return render_template('summarization.html')


@summarization.route('/ext', methods=['POST'])
def submitSummarization_ext():
    parameters = request.get_json(force=True)
    if request.method == 'POST':
        result = requests.post(conf.summarization['url_ext'], json=parameters)
        resultdict = result.json()
        print(resultdict)
        return jsonify(resultdict)

@summarization.route('/gen', methods=['POST'])
def submitSummarization_gen():
    parameters = request.get_json(force=True)
    if request.method == 'POST':
        result = requests.post(conf.summarization['url_gen'], json=parameters)
        resultdict = result.json()
        print(resultdict)
        return jsonify(resultdict)
