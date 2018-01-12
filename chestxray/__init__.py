from flask import Blueprint

chestxray = Blueprint('chestxray', __name__, template_folder='templates', static_folder='static')

from . import chestxray_controller