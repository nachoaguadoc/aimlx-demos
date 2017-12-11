from flask import Blueprint

emotion = Blueprint('emotion', __name__, template_folder='templates', static_folder='static')

from . import emotion_controller