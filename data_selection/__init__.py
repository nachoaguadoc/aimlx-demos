from flask import Blueprint

data_selection = Blueprint('data_selection', __name__, template_folder='templates', static_folder='static')

from . import data_selection_controller
