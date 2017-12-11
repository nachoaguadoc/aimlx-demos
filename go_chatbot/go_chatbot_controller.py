from flask import jsonify, request, render_template
import requests
import config_template as conf
from . import go_chatbot

@go_chatbot.route('')
def showGOChatbotPage():
    # make a GET request to initialize the chatbot
    requests.post(conf.chatbot_goaloriented['url_get'])
    return render_template('go_chatbot.html')


@go_chatbot.route('',  methods=['POST'])
def sendUtterance():
    parameters = request.get_json(force=True)
    if request.method == 'POST':
        result = requests.post(conf.chatbot_goaloriented['url_post'], json=parameters)
        resultdict = result.json()
        return jsonify(resultdict)