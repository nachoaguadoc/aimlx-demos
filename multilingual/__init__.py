from flask import Blueprint

multilingual = Blueprint('multilingual', __name__, template_folder='templates', static_folder='static')

from . import multilingual_controller