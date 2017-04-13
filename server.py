from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

from flask_cors import CORS, cross_origin

import config as conf
import subprocess
import os
import re
import socket

app = Flask(__name__)
CORS(app)

# Chatbot route handling
@app.route('/chatbot/<demo>')
def getChatbot(demo):
    if demo=='ubuntu':
        return render_template('chatbot_ubuntu.html')
    elif demo=='swisscom':
        return render_template('chatbot_swisscom.html')
    elif demo=='ubuntuseq2seq':
        return render_template('chatbot_seq2seq_ubuntu.html')
@app.route('/chatbot/<demo>', methods=['POST'])
def submitChatbot(demo):
    question = request.form['question']
    print("Question:", question)
    if request.method == 'POST':
        if demo=='ubuntu':
            predict_dir = conf.chatbot_ubuntu['path']
            model_id = conf.chatbot_ubuntu['model_id']
            python_env = conf.chatbot_ubuntu['python_env']
        elif demo=='swisscom':
            predict_dir = conf.chatbot_swisscom['path']
            model_id = conf.chatbot_swisscom['model_id']
            python_env = conf.chatbot_swisscom['python_env']
        elif demo=='ubuntuseq2seq':
            socket_address = conf.chatbot_ubuntu_seq2seq['socket_address']
            socket_port = conf.chatbot_ubuntu_seq2seq['socket_port']
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((socket_address, socket_port))
            s.sendall(question.encode())
            answer = s.recv(1024).decode("utf-8")
            s.close()
            return jsonify({'seq2seq':answer})
        
        model_dir = predict_dir + 'runs/' + model_id
        subprocess.call([python_env, predict_dir + 'demo_prediction.py', '--model_dir=' + model_dir, '--raw_query=' + "'" + question + "'"])
        # Generate answer here
        with open(predict_dir + "answers.txt", "r") as text_file:
            answer = text_file.readlines()[0]
        answer = answer.split('___|||___')
        encoder = answer[0].split('___***___');
        solr = answer[1].split('___***___');
        encoder = answer[0].split('___***___');
        answer = {'solr':solr, 'encoder': encoder}
        return jsonify(answer)

# Opinion target route handling
def parse_output(output_path):
    f = open(output_path,'r')
    pred_labels = []
    for line in f:
        line = line.strip()
        if len(line.split()) == 3:
            pred_label = line.split()[2]
            pred_labels.append(pred_label)
    return " ".join(pred_labels)

@app.route('/opinion')
def getOpinion():
    return render_template('opinion_target.html')

@app.route('/opinion', methods=['POST'])
def submitOpinion():
    input = request.form['input']
    if request.method == 'POST':
        script_dir = conf.ate['path'] + 'run_demo.py'
        predict_dir = conf.ate['path'] + '/predictions/predictions.txt'
        python_env = conf.ate['python_env']
        response = ""
        subprocess.call([python_env, script_dir, '--sentence', '"'+ input + '"'])
        answer = parse_output(predict_dir)
        print("Question received for ATE project", answer)
        answer = {'labels': answer}
        return jsonify(answer)

# NER route handling
@app.route('/ner')
def getNER():
    return render_template('ner.html')

@app.route('/ner', methods=['POST'])
def submitNER():
    input = request.form['input']
    if request.method == 'POST':
        script_dir = conf.ner['path'] + 'run_demo.py'
        predict_dir = conf.ner['path'] + 'predictions/predictions.txt'
        python_env = conf.ner['python_env']
        response = ""
        subprocess.call([python_env, script_dir, '--sentence', '"'+ input + '"'])
        answer = parse_output(predict_dir)
        print("Question received for NER project", answer)
        answer = {'labels': answer}
        return jsonify(answer)

# KP Extraction route handling
@app.route('/kp')
def getKP():
    return render_template('kp_extraction.html')

@app.route('/kp', methods=['POST'])
def submitKP():
    if request.method == 'POST':
        print('input ',request.form['inp_url'])
        html_content = subprocess.check_output(['curl', request.form['inp_url']], close_fds=True)
        write_file(os.path.join(conf.kpextract['path'],'tmp','html_file'), html_content.decode('utf-8'))
        text_content = subprocess.check_output([conf.kpextract['python_env'], conf.kpextract['fetcher_path'], os.path.join(conf.kpextract['path'],'tmp','html_file')])
        write_file(os.path.join(conf.kpextract['path'],'tmp','raw_text'),text_content.decode('utf-8'))
        subprocess.call([conf.kpextract['python_env'], '-m', 'kpextract.models.singlerank', os.path.join(conf.kpextract['path'],'tmp','raw_text') , '6', '14', os.path.join(conf.kpextract['path'],'tmp')])
        html_doc, list_kp = read_kp_output()
        return render_template('kpboard.html', html_doc=html_doc, list_kp=list_kp)

def read_file(path):
    with open(path, 'r') as f:
        return f.read()

def write_file(path, s):
    with open(path, 'w') as f:
        f.write(s)

          
def read_kp_output():
    processed_text = read_file(os.path.join(conf.kpextract['path'],'tmp','result_text.txt'))
    processed_text = re.sub('\n+', '\n', processed_text)
    html_doc = processed_text.replace('\n', '</div><div class=start></br>')
    html_doc = html_doc.replace('<phrase>', '<span class=kp>')
    html_doc = html_doc.replace('</phrase>', '</span>')
    html_doc = '<div class=start>' + html_doc + '</div>'

    list_kp_text =  read_file(os.path.join(conf.kpextract['path'],'tmp','result_kp.txt'))
    list_kp = list_kp_text.split(';')
    
    return html_doc, list_kp


# Summary route handling
@app.route('/summary')
def getSummary():
    return render_template('summary.html')

import os
if not os.path.exists('%s/run/launch.py'%conf.summary['path']):
    print('File required to run summary')
import sys
sys.path.insert(0,'%s/run'%conf.summary['path'])
ret_path=os.path.abspath('.')
os.chdir(conf.summary['path'])
import launch
os.chdir(ret_path)

@app.route('/summary/<input>', methods=['POST'])
def submitSummary(input):
    if request.method == 'POST':
        # Generate answer here
        answer = input.replace('**n**', '\n')
        ret_path=os.path.abspath('.')
        os.chdir(conf.summary['path'])
        with open('tmp.txt','w') as fopen:
            fopen.write(answer)
        launch.predict()
        answer = ''.join(open('output.txt','r').readlines())
        os.system('rm tmp.txt output.txt')
        os.chdir(ret_path)
        return answer

if __name__ == '__main__':
    app.run(host= '127.0.0.1')
