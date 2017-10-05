import re
import select
import socket
import subprocess
import sys
from multiprocessing import Value
import json

import requests
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request
from flask_cors import CORS
from pymongo import MongoClient

import config_template as conf

socket_goal_chatbot = None

if (conf.neural_programmer['mongo']):
    client = MongoClient(conf.neural_programmer['mongo_address'], conf.neural_programmer['mongo_port'], connect=False)
    db = client[conf.neural_programmer['mongo_db']]
    feedback_coll = db[conf.neural_programmer['mongo_feedback_coll']]
    use_coll = db[conf.neural_programmer['mongo_use_coll']]

counter = Value('i', 0)
users = {}

app = Flask(__name__)
CORS(app)


def encode_sth(item):
    coding = ['iso-8859-1', 'utf8', 'latin1', 'ascii']
    for coding_format in coding:
        try:
            coded = item.encode(coding_format)
            return coded
        except:
            continue
    raise Exception('Unable to encode', item)


def decode_sth(item):
    coding = ['iso-8859-1', 'utf8', 'latin1', 'ascii']
    for coding_format in coding:
        try:
            coded = item.decode(coding_format)
            return coded
        except:
            continue
    raise Exception('Unable to decode', item)


# Chatbot route handling
@app.route('/chatbot/<demo>')
def getChatbot(demo):
    if demo == 'ubuntu':
        return render_template('chatbot_ubuntu.html')
    elif demo == 'swisscom':
        return render_template('chatbot_swisscom.html')
    elif demo == 'ubuntuseq2seq':
        return render_template('chatbot_seq2seq_ubuntu.html')
    elif demo == 'goaloriented':
        global socket_goal_chatbot
        socket_address = conf.chatbot_goaloriented['socket_address']
        socket_port = conf.chatbot_goaloriented['socket_port']
        socket_goal_chatbot = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket_goal_chatbot.connect((socket_address, socket_port))
        user_goal = json.loads(socket_goal_chatbot.recv(1024).decode("utf-8"))
        return render_template('chatbot_goaloriented.html', request_slots=user_goal['request_slots'], inform_slots=user_goal['inform_slots'])


@app.route('/chatbot/<demo>', methods=['POST'])
def submitChatbot(demo):
    parameters = request.get_json(force=True)
    print("Demo Ubuntu Chatbot:", parameters)
    question = parameters['question']
    print("Question:", question)
    if request.method == 'POST':
        if demo == 'ubuntu':
            predict_dir = conf.chatbot_ubuntu['path']
            model_id = conf.chatbot_ubuntu['model_id']
            python_env = conf.chatbot_ubuntu['python_env']
        elif demo == 'swisscom':
            predict_dir = conf.chatbot_swisscom['path']
            model_id = conf.chatbot_swisscom['model_id']
            python_env = conf.chatbot_swisscom['python_env']
        elif demo == 'ubuntuseq2seq':
            socket_address = conf.chatbot_ubuntu_seq2seq['socket_address']
            socket_port = conf.chatbot_ubuntu_seq2seq['socket_port']
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((socket_address, socket_port))
            s.sendall(question.encode())
            answer = s.recv(1024).decode("utf-8")
            s.close()
            return jsonify({'seq2seq': answer})
        elif demo == 'goaloriented':
            global socket_goal_chatbot
            socket_goal_chatbot.sendall(question.encode())
            answer = socket_goal_chatbot.recv(1024).decode("utf-8")
            return jsonify({'chatbot_reply': answer})

        model_dir = predict_dir + 'runs/' + model_id
        subprocess.call([python_env, predict_dir + 'demo_prediction.py', '--model_dir=' + model_dir,
                         '--raw_query=' + "'" + question + "'"])
        # Generate answer here
        with open(predict_dir + "answers.txt", "r") as text_file:
            answer = text_file.readlines()[0]
        answer = answer.split('___|||___')
        encoder = answer[0].split('___***___');
        solr = answer[1].split('___***___');
        encoder = answer[0].split('___***___');
        answer = {'solr': solr, 'encoder': encoder}
        return jsonify(answer)


# Chatbot route handling
@app.route('/neural_programmer')
def getLandingNeuralProgrammer():
    return render_template('neural_programmer_landing.html')


# Chatbot route handling
@app.route('/neural_programmer/')
def getLanding2NeuralProgrammer():
    return render_template('neural_programmer_landing.html')


# Chatbot route handling
@app.route('/neural_programmer/<demo>')
def getNeuralProgrammer(demo):
    if demo == '':
        return render_template('neural_programmer_landing.html')
    elif demo == 'football':
        return render_template('neural_programmer_football.html')
    elif demo == 'swisscom':
        return render_template('neural_programmer_swisscom.html')
    elif demo == 'tutorial':
        return render_template('neural_programmer_tutorial.html')
    elif demo == 'steps':
        return render_template('neural_programmer_steps.html')
    elif demo == "simple":
        return render_template('neural_programmer_simple.html')


@app.route('/neural_programmer/<demo>', methods=['POST'])
def submitNeuralProgrammer(demo):
    parameters = request.get_json(force=True)
    print("Demo Neural Programmer:", parameters)
    if (demo == "feedback"):
        print("Feedback received")
        feedback_id = feedback_coll.insert_one(parameters).inserted_id
        print("Debug:", parameters)
        print("ID:", feedback_id)
        answer = "Feedback " + str(feedback_id) + " sent!"
        return jsonify({'answer': answer})

    elif (demo == "demo_question"):
        tokens = parameters['question']
        table_key = parameters['table_key']
        print("Question:", tokens, "Table:", table_key)
        if request.method == 'POST':
            socket_address = conf.neural_programmer['socket_address']
            socket_port = conf.neural_programmer['socket_port']
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((socket_address, socket_port))
            msg = table_key + '****----****' + tokens
            s.sendall(msg.encode())
            answer = s.recv(1024).decode("utf-8")
            s.close()
            return jsonify({'neural_programmer': answer})

    elif (demo == "question"):
        tokens = parameters['question']
        table_key = parameters['table_key']
        user_id = parameters['user_id']
        timestamp = parameters['timestamp']
        question_id = parameters['question_id']
        demo = parameters['demo']

        info = {"question": tokens, "table_key": table_key, "user_id": user_id, "timestamp": timestamp, "demo": demo,
                "question_id": question_id}
        feedback_id = use_coll.insert_one(info).inserted_id
        print("Question ID", question_id, "with text", tokens, "about table", table_key, "from user", user_id,
              "using the", demo, "demo")
        print("Question stored:", feedback_id)

        if request.method == 'POST':
            socket_address = conf.neural_programmer['socket_address']
            socket_port = conf.neural_programmer['socket_port']
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((socket_address, socket_port))
            msg = table_key + '****----****' + tokens
            s.sendall(msg.encode())
            answer = s.recv(1024).decode("utf-8")
            s.close()
            return jsonify({'neural_programmer': answer})


# Opinion target route handling
def parse_output(output_path):
    f = open(output_path, 'r')
    pred_labels = []
    for line in f:
        line = line.strip()
        if len(line.split()) == 3:
            pred_label = line.split()[2]
            pred_labels.append(pred_label)
    return " ".join(pred_labels)


def parse_input(input, file):
    f = open(file, "w")
    tokens = [token for token in input.split()]
    for token in tokens:
        f.write(token + " O\n")


@app.route('/opinion')
def getOpinion():
    return render_template('opinion_target.html')


@app.route('/opinion', methods=['POST'])
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

@app.route('/churn')
def getChurn():
    return render_template('churn.html')

@app.route('/churn', methods=['POST'])
def submitChurn():
    parameters = request.get_json(force=True)
    print("Demo Churn:", parameters)
    tweet = parameters['input']
    # learning_type = request.get_json(force=True)["learning"]
    port = conf.churn['e_port']
    ip = conf.churn['e_host']
    if request.method == 'POST':
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        server_address = (ip, port)
        try:
            print('sending "%s"' % tweet)
            sent = sock.sendto(tweet.encode(), server_address)
            print('waiting to receive')
            data, server = sock.recvfrom(4096)
            answer = {'answer': data.decode()}
            print(data.decode())
        finally:
            sock.close()
        return jsonify(answer)

# NER route handling
@app.route('/ner')
def getNER():
    return render_template('ner.html')


@app.route('/ner', methods=['POST'])
def submitNER():
    parameters = request.get_json(force=True)
    print("Demo NER:", parameters)
    input = parameters['input']
    if request.method == 'POST':
        script_dir = conf.ner['path'] + 'run_demo.py'
        predict_dir = conf.ner['path'] + 'predictions/predictions.txt'
        python_env = conf.ner['python_env']
        response = ""
        subprocess.call([python_env, script_dir, '--sentence', '"' + input + '"'])
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
        post_parameters = request.get_json(force=True)
        print("Demo KP:", post_parameters)
        for r in post_parameters:
            post_parameters[r] = str(post_parameters[r])
        result = requests.post(conf.kpextract['api_url'], json=post_parameters)
        result_dict = result.json()
        return render_template('kpboard.html', html_doc=post_process(result_dict['processed_text']),
                               list_kp=result_dict['list_kp'])


@app.route('/kp_api', methods=['POST'])
def submitKP_API():
    if request.method == 'POST':
        post_parameters = request.get_json(force=True)
        print("Demo KP:", post_parameters)
        for r in post_parameters:
            post_parameters[r] = str(post_parameters[r])
        if 'window_size' not in post_parameters:
            post_parameters['window_size'] = '5'
        if 'ilp' not in post_parameters:
            post_parameters['ilp'] = 'true'
        result = requests.post(conf.kpextract['api_url'], json=post_parameters)
        return jsonify(result.json())

@app.route('/kp_emb')
def getKP_emb():
    return render_template('kp_extraction_emb.html')

@app.route('/kp_emb', methods=['POST'])
def submitKP_emb():
    if request.method == 'POST':
        post_parameters = request.get_json(force=True)
        print('Demo KP embedding', post_parameters)
        for r in post_parameters:
            post_parameters[r] = str(post_parameters[r])
        result = requests.post(conf.kpextract['api_emb_url'], json=post_parameters)
        result_dict = result.json()
        process_api_result = []

        for e in result_dict['api_result']:
            e['relevance'] = round(e['relevance'] * 100)
            process_api_result.append(e)

        process_api_result = sorted(process_api_result, key=lambda k: k['relevance'], reverse=True)

        return render_template('kpboard_emb.html', html_doc=post_process(result_dict['processed_text']),
                               list_kp=process_api_result)



def read_file(path):
    with open(path, 'r') as f:
        return f.read()


def write_file(path, s):
    with open(path, 'w') as f:
        f.write(s)


def post_process(processed_text):
    processed_text = re.sub('\n+', '\n', processed_text)  # Multiple jumplines into 1 jumpline
    html_doc = processed_text.replace('\n', '</div><div class=start></br>')
    html_doc = html_doc.replace('<phrase>', '<span class=kp>')
    html_doc = html_doc.replace('</phrase>', '</span>')
    html_doc = '<div class=start>' + html_doc + '</div>'

    return html_doc


@app.route('/summary')
def getSummary():
    return getSummaryURL()


@app.route('/summary', methods=['POST'])
def submitSummary():
    return submitSummary()


@app.route('/summary_url')
def getSummaryURL():
    return render_template('summary_url.html')


@app.route('/summary_url', methods=['POST'])
def submitSummaryURL():
    input = request.get_json(force=True)['inp_url']
    model_type = request.get_json(force=True)['model_type']
    url = input.rstrip('\n')
    if request.method == 'POST':
        if model_type == 'extractive':
            host = conf.summary['e_host']
            port = conf.summary['e_port']
        elif model_type == 'abstractive':
            host = conf.summary['a_host']
            port = conf.summary['a_port']
        elif model_type == 'mixed':
            host = conf.summary['m_host']
            port = conf.summary['m_port']
        else:
            return jsonify({'text': 'Unrecognized model_type: %s' % model_type,
                            'summary': 'Unrecognized model_type: %s' % model_type})

        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.settimeout(2)

        try:
            client.connect((host, port))
            print('Socket established on %s:%d!' % (host, port))
        except:
            return jsonify({'text': 'Unable to connect the server', 'summary': 'Unable to connect the server'})

        socket_list = [client, sys.stdin]
        client.send(encode_sth(url))

        print('Start analyzing %s' % url)
        while True:
            ready2read, ready2write, in_err = select.select(socket_list, [], [])
            for sock in ready2read:
                if sock == client:
                    response = decode_sth(sock.recv(65536))
                    if not response:
                        return jsonify(
                            {'text': 'Unable to connect the server', 'summary': 'Unable to connect the server'})
                    else:
                        parts = response.split('@@@@@')
                        if len(parts) == 1:
                            return jsonify({'text': parts[0], 'summary': parts[0]})
                        else:
                            return jsonify({'text': parts[0], 'summary': parts[1]})


@app.route('/gsw')
def get_gsw2de():
    return render_template('gswjs.html')


@app.route('/gsw', methods=['POST'])
def submit_gsw2de():
    if request.method == 'POST':
        post_parameters = request.get_json(force=True)
        print("Demo GSW:", post_parameters)
        text = post_parameters['text']
        oov_method = post_parameters['oov_method']
        json_result = _translate_helper(text, oov_method)
        return jsonify(json_result)


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


@app.route('/translate', methods=['GET'])
def translate_stdlangs():
    return render_template('machine_translation_stdlangs.html')


@app.route('/translate', methods=['POST'])
def submit_translate_stdlangs():
    if request.method == 'POST':
        post_parameters = request.get_json(force=True)
        print("Demo MT standard languages:", post_parameters)
        text = post_parameters['text']
        data = {'text': text}
        src = post_parameters['src']
        tgt = post_parameters['tgt']
        url = conf.machine_translation_stdlangs['base_url'] + '/' + src + '/' + tgt
        r = requests.post(url, json=data)
        if not r.ok:
            abort(400)
        print(r.json())
        return jsonify(r.json())


if __name__ == '__main__':
    app.run(host='127.0.0.1')
