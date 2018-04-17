from flask import Blueprint
from flask import render_template

multilingual_api = Blueprint('multilingual_api', __name__)


@multilingual_api.route('')
def index():
    return render_template('index.html')


@multilingual_api.route('/alldocs', methods=['GET', 'POST'])
def process_all_doc():
    return render_template('multilingual_sample_docs.html')


@multilingual_api.route('/sendalldocs', methods=['GET', 'POST'])
def process_send_all_doc():
    return render_template('multilingual_sample_docs.html')


@multilingual_api.route('/choosedoc', methods=['GET', 'POST'])
def process_choose_doc():
    return render_template('multilingual_choose_doc.html')
