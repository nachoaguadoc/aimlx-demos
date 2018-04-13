from flask import request, render_template, redirect, url_for
import requests
from . import tweet_label
import config as conf
import json

from tweet_label.utils_label import update_db_tweet, get_db_tweet, get_stat_number, get_yml_info


@tweet_label.route('', methods=['GET'])
def label_tweet_home():
    files = get_yml_info(conf.tweet_label['dir_tweets'])
    files = get_stat_number(files, conf.tweet_label['dir_tweets'])
    return render_template('home_tweet_label.html', files=files)


@tweet_label.route('/go', methods=['GET', 'POST'])
def label_db():

    if request.method == 'GET':
        return redirect(url_for('tweet_label.label_tweet_home'))

    if 'db_info' not in request.form:
        return redirect(url_for('tweet_label.label_tweet_home'))

    struct = get_yml_info(conf.tweet_label['dir_tweets'])

    if 'action' in request.form and request.form['action'] == 'back':
        data = get_db_tweet(request.form['db_info'], struct, conf.tweet_label['dir_tweets'],
                            id_tweet=request.form['id_tweet_prev'])
    else:
        # Update if previous data was labeled
        update_db_tweet(request.form, struct, conf.tweet_label['dir_tweets'])
        # Take a row to label in the file
        data = get_db_tweet(request.form['db_info'], struct, conf.tweet_label['dir_tweets'])

    if data is None:
        return redirect(url_for('tweet_label.label_tweet_home'))

    # Add previous id to go back if needed
    if 'id_tweet' in request.form:
        data['id_tweet_prev'] = request.form['id_tweet']

    # Render new annotation
    return render_template('tweet_label.html', data=data)


@tweet_label.route('/translation', methods=['POST'])
def translation():

    if 'text' not in request.form:
        return 'No valid text'

    text = request.form['text'].replace('&lt;', '<').replace('&gt;', '>')
    data = json.dumps({"jsonrpc": "2.0", "method": "LMT_handle_jobs",
                       "params": {"jobs": [{"kind": "default", "raw_en_sentence": text}],
                                  "lang": {"user_preferred_langs": ['FR', 'DE'],
                                           "source_lang_user_selected": 'auto',
                                           "target_lang": 'EN'},
                                  "priority": -1}, "id": 0})

    r = requests.post("https://www.deepl.com/jsonrpc", data=data)

    try:
        r = json.loads(r.text)
        r = r['result']['translations'][0]['beams'][0]['postprocessed_sentence']
        return r
    except Exception as e:
        return 'No translation found'
