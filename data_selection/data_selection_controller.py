from flask import jsonify, request, render_template
import requests
import config as conf
from . import data_selection

@data_selection.route('')
def showDataSelectionPage():
    return render_template('data_selection.html')

@data_selection.route('', methods=['POST'])
def submitDataSelection():
    parameters = request.get_json(force=True)
    result = requests.post(conf.data_selection['url'] + '/' + parameters['sampleId'], json=parameters)
    resultdict = result.json()
    return jsonify(resultdict)
