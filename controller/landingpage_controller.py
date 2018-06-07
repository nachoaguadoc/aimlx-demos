from flask import Blueprint
from flask import send_from_directory
from werkzeug.utils import redirect

PATH_NESTED_LANDING_PAGE = 'landingpage/'
landingpage_api = Blueprint('landingpage_api', __name__)


# Chatbot route handling
@landingpage_api.route('/')
def get_landingpage():
    return send_from_directory(PATH_NESTED_LANDING_PAGE, 'index.html')
