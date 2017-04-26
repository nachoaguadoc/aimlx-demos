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
import sys
import tensorflow as tf
import nltk.data

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
        print('input ', request.form['inp_url'])
        html_content = subprocess.check_output(['curl', request.form['inp_url']], close_fds=True)
        write_file(os.path.join(conf.kpextract['path'],'tmp','html_file'), html_content.decode('utf-8', 'ignore'))
        text_content = subprocess.check_output([conf.kpextract['python_env'], conf.kpextract['fetcher_path'], os.path.join(conf.kpextract['path'],'tmp','html_file')])
        write_file(os.path.join(conf.kpextract['path'],'tmp','raw_text'),text_content.decode('utf-8', 'ignore'))
        ilp_arg = ''
        if request.form(['ilp']):
            ilp_arg = '--ilp'
        subprocess.call([conf.kpextract['python_env'], '-m', 'kpextract.models.graph_based', os.path.join(conf.kpextract['path'], 'tmp', 'raw_text'), request.form['window'], request.form['nbkp'], os.path.join(conf.kpextract['path'],'tmp'), ilp_arg])
        html_doc, list_kp = read_kp_output()
        return render_template('kpboard.html', html_doc=html_doc, list_kp=list_kp)


def read_file(path):
    with open(path, 'r') as f:
        return f.read()


def write_file(path, s):
    with open(path, 'w') as f:
        f.write(s)


def read_kp_output():
    processed_text = read_file(os.path.join(conf.kpextract['path'], 'tmp', 'result_text.txt'))
    processed_text = re.sub('\n+', '\n', processed_text) #Multiple jumplines into 1 jumpline
    html_doc = processed_text.replace('\n', '</div><div class=start></br>')
    html_doc = html_doc.replace('<phrase>', '<span class=kp>')
    html_doc = html_doc.replace('</phrase>', '</span>')
    html_doc = '<div class=start>' + html_doc + '</div>'

    list_kp_text = read_file(os.path.join(conf.kpextract['path'], 'tmp', 'result_kp.txt'))
    list_kp = list_kp_text.split(';')
    
    return html_doc, list_kp


sys.path.insert(0,conf.summary['path']+os.sep+'run')
sys.path.insert(0,conf.summary['path']+os.sep+'util')
ret_path=os.path.abspath('.')
os.chdir(conf.summary['path'])
import laucher
import xml_parser
laucher_params=xml_parser.parse(conf.summary['laucher_params_file'],flat=False)
app.clf=laucher.laucher(laucher_params)
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
os.chdir(ret_path)

# Summary route handling
@app.route('/summary')
def getSummary():
    return render_template('summary.html')

@app.route('/summary/<input>', methods=['POST'])
def submitSummary(input):
    if request.method == 'POST':
        os.chdir(conf.summary['path'])
        #global my_launcher
        #laucher_params=xml_parser.parse(conf.summary['laucher_params_file'],flat=False)
        #app.clf=laucher.laucher(laucher_params)
        app.clf.start()
        answer = input.replace('**n**', '\n')
        with open('tmp.txt','w') as fopen:
            fopen.write(answer)
        output=app.clf.run('tmp.txt')
        os.system('rm tmp.txt')
        #os.system('rm -rf tmp')
        os.chdir(ret_path)
        #app.clf.end()
        output.replace('#','$')
        return output

# Summarization handling a url
@app.route('/summary_url')
def getSummaryURL():
    return render_template('summary_url.html')

@app.route('/summary_url', methods=['POST'])
def submitSummaryURL():
    if request.method == 'POST':
        os.chdir(conf.summary['path'])
        print('input ',request.form['inp_url'])
        html_content = subprocess.check_output(['curl', request.form['inp_url']], close_fds=True)
        with open('tmp.html','w') as fopen:
            fopen.write(html_content.decode('utf-8','ignore'))
        text_content = subprocess.check_output([conf.kpextract['python_env'], conf.kpextract['fetcher_path'], 'tmp.html'])
        text_content = text_content.decode('utf-8','ignore')
        text_content_list = []
        for sentence in tokenizer.tokenize(text_content):
            #print(type(sentence))
            #print(sentence.split(' '))
            print(len(sentence.split(' ')))
            if len(sentence.split(' '))>=5:
                text_content_list.append(sentence)
            else:
                print('>>>'+sentence)
        text_content = '\n'.join(text_content_list)
        
        with open('tmp.txt','w') as fopen:
            fopen.write(text_content)
        text_content_list_with_idx=[]
        for idx,sentence in enumerate(text_content.split('\n')):
            text_content_list_with_idx.append('[%d] %s'%(idx+1,sentence))
        text_content='\n'.join(text_content_list_with_idx)
        # print(text_content)
        app.clf.start()
        output=app.clf.run('tmp.txt')
        os.system('rm tmp.html')
        os.system('rm tmp.txt')
        os.chdir(ret_path)
        print(output)
        return jsonify({'text':text_content,'summary':output})

if __name__ == '__main__':
    sys.path.insert(0,conf.summary['path']+os.sep+'run')
    sys.path.insert(0,conf.summary['path']+os.sep+'util')
    ret_path=os.path.abspath('.')
    os.chdir(conf.summary['path'])
    import laucher
    import xml_parser
#    laucher_params=xml_parser.parse(conf.summary['laucher_params_file'],flat=False)
#    app.clf=laucher.laucher(laucher_params)
    os.chdir(ret_path)
    app.run(host= '127.0.0.1')
