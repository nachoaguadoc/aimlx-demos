from flask import Blueprint

summarization = Blueprint('summarization', __name__, template_folder='templates', static_folder='static')

from . import summarization_controller
