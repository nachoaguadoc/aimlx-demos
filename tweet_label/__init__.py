from flask import Blueprint

tweet_label = Blueprint('tweet_label', __name__, template_folder='templates', static_folder='static')

from . import tweet_label_controller
