from flask import Blueprint

argumentation = Blueprint('argumentation', __name__, template_folder='templates', static_folder='static')

from . import argumentation_controller
