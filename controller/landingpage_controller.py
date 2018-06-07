import json

from flask import Blueprint, jsonify
from flask import send_from_directory

PATH_NESTED_LANDING_PAGE = 'landingpage/'

landingpage_api = Blueprint('landingpage_api', __name__)


@landingpage_api.route('')
def get_landingpage():
    return send_from_directory(PATH_NESTED_LANDING_PAGE, 'index.html')


@landingpage_api.route('demos')
def get_all_demos_json():
    with open('demos.json') as f:
        demos_dict = json.load(f)
        return jsonify(demos_dict)
