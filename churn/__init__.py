from flask import Blueprint

churn = Blueprint('churn', __name__, template_folder='templates', static_folder='static')

from . import churn_controller
