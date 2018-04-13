from flask import request, render_template, redirect, url_for
import requests
from . import tweet_label
import config as conf
import json


@tweet_label.route('', methods=['GET'])
def label_tweet_home():

    try:
        response = requests.post(conf.tweet_label['api_url'] + 'db_list')
        files = json.loads(response.text)
    except Exception as e:
        files = []

    return render_template('home_tweet_label.html', files=files)


@tweet_label.route('/go', methods=['GET', 'POST'])
def label_db():

    if request.method == 'GET' or 'db_info' not in request.form:
        return redirect(url_for('tweet_label.label_tweet_home'))

    try:
        response = requests.post(conf.tweet_label['api_url'] + 'get_tweet', data=json.dumps(request.form))
        data = json.loads(response.text)
    except Exception as e:
        return redirect(url_for('tweet_label.label_tweet_home'))

    # Render new annotation
    return render_template('tweet_label.html', data=data)


@tweet_label.route('/translation', methods=['POST'])
def translation():

    if 'text' not in request.form:
        return 'No valid text'

    text = request.form['text'].replace('&lt;', '<').replace('&gt;', '>')
    data = json.dumps({'text': text})
    response = requests.post(conf.tweet_label['api_url'] + 'translation', data=data)

    return response.text

