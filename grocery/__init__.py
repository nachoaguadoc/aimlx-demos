from flask import Blueprint

grocery = Blueprint('grocery', __name__, template_folder='templates', static_folder='static')

from . import grocery_controller