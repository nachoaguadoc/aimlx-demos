from flask import request, render_template, redirect, url_for, session
import requests
from . import tweet_label
import config as conf
import json


# Displays on page and login for user (just input with username)
@tweet_label.route('', methods=['GET', 'POST'])
def label_tweet_home():

    if request.method == 'POST':
        username = request.form['username']
        print('Continue with user logged as: {}'.format(username))
        session['username'] = username

        return redirect(url_for('tweet_label.tweet_db'))

    return render_template('home_tweet_label.html')


# Displays database of tweets to keep track of current state
@tweet_label.route('/db', methods=['GET'])
def tweet_db():

    if 'username' not in session:
        return redirect(url_for('tweet_label.label_tweet_home'))
    try:
        response = requests.post(conf.tweet_label['api_url'] + 'db_list', data=session['username'])
        files = json.loads(response.text)
        print('files', files)
    except Exception as e:
        files = []

    return render_template('tweet_db.html', files=files, username=session['username'])


# Display tweet labelling process
@tweet_label.route('/go', methods=['GET', 'POST'])
def tweet_label_go():

    if request.method == 'GET' or 'db_info' not in request.form:
        return redirect(url_for('tweet_label.tweet_db'))

    try:
        data = request.form.to_dict()
        data['username'] = session['username']
        response = requests.post(conf.tweet_label['api_url'] + 'get_tweet', data=json.dumps(data))
        data = json.loads(response.text)
    except Exception as e:
        return redirect(url_for('tweet_label.tweet_db'))

    # Render new annotation
    return render_template('tweet_label.html', data=data, username=session['username'])


@tweet_label.route('/translation', methods=['POST'])
def translation():

    if 'text' not in request.form:
        return 'No valid text'

    text = request.form['text'].replace('&lt;', '<').replace('&gt;', '>')
    data = json.dumps({'text': text})
    response = requests.post(conf.tweet_label['api_url'] + 'translation', data=data)

    return response.text

