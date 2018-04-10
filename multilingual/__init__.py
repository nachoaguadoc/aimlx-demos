from flask import Blueprint

summarization = Blueprint('multilingual', __name__, template_folder='templates', static_folder='static')

from . import multilingual_controller