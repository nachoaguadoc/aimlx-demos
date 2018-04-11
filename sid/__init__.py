from flask import Blueprint

sid = Blueprint('sid', __name__, template_folder='templates', static_folder='static')

from . import sid_controller
