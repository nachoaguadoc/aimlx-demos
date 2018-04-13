from flask import Blueprint

speech_emotion = Blueprint('speech_emotion', __name__, template_folder='templates', static_folder='static')

from . import speech_emotion_controller