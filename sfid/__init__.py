from flask import Blueprint

sfid = Blueprint('sfid', __name__, template_folder='templates', static_folder='static')

from . import sfid_controller
