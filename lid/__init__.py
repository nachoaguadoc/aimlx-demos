from flask import Blueprint

lid = Blueprint('lid', __name__, template_folder='templates', static_folder='static')

from . import lid_controller
