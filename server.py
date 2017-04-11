from flask import Flask
from flask import render_template
from flask import request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# Chatbot route handling
@app.route('/chatbot')
def getChatbot():
    return render_template('chatbot.html')

@app.route('/chatbot/<question>', methods=['POST'])
def submitChatbot(question):
    if request.method == 'POST':
        # Generate answer here
        answer = ''
        return render_template('chatbot.html', answer=answer)

# Opinion target route handling
@app.route('/opinion')
def getOpinion():
    return render_template('opinion_target.html')

@app.route('/opinion/<input>', methods=['POST'])
def submitOpinion(input):
    if request.method == 'POST':
        # Generate answer here
        answer = ''
        return render_template('opinion_target', answer=answer)

# NER route handling
@app.route('/ner')
def getNER():
    return render_template('ner.html')

@app.route('/ner/<input>', methods=['POST'])
def submitNER(input):
    if request.method == 'POST':
        # Generate answer here
        answer = ''
        return render_template('ner.html', answer=answer)

# KP Extraction route handling
@app.route('/kp')
def getKP():
    return render_template('kp_extraction.html')

@app.route('/kp/<input>', methods=['POST'])
def submitKP(input):
    if request.method == 'POST':
        # Generate answer here
        answer = ''
        return render_template('kp_extraction.html', answer=answer)

# Summary route handling
@app.route('/summary')
def getSummary():
    return render_template('summary.html')

@app.route('/summary/<input>', methods=['POST'])
def submitSummary(input):
    if request.method == 'POST':
        # Generate answer here
        answer = ''
        return render_template('summary.html', answer=answer)