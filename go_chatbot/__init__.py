from flask import Blueprint

go_chatbot = Blueprint('go_chatbot', __name__, template_folder='templates', static_folder='static')

from . import go_chatbot_controller
