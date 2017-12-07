from flask import Blueprint
from flask import Flask, abort
from flask import jsonify
from flask import render_template
from flask import request, send_from_directory
import jsonpickle
import json
import requests
import config as conf
import helpers
import os
from . import material


@material.route('', methods=['GET'])
def ask_for_image():
    """ Ask for a given image """
    return render_template('material.html')


@material.route('/upload', methods=['POST'])
def upload():
    """
     define the upload pipeline, which can be triggered by upload html request
    :return: json.dump({"list":processed_images})
    """
    global processed_images
    APP_ROOT = os.path.dirname(os.path.abspath(__file__))
    target = os.path.join(APP_ROOT, conf.material['dir'])

    if not os.path.isabs(target):
        os.mkdir(target)
    else:
        print('Directory already exists {} '.format(target))

    print("Begin upload process")
    f = request.files   # What for?
    destination = ''    # init destination
    for upload in request.files.getlist("fileToUpload"):
        filename = upload.filename
        print("Upload type {} \n Upload filename {}".format(type(upload), filename))
        destination = '/'.join([target, filename])
        print("Incoming file : {}".format(filename))
        print("Save it to: ", destination)
        upload.save(destination)

    test_url = conf.material['url']

    # prepare headers
    content_type = 'application/json'
    headers = {'content-type': content_type}

    list = {'image_list': destination}

    # Send the request to Prediction Handler and receive the following request
    response = requests.post(test_url, data=jsonpickle.encode(list), headers=headers)

    # decode response
    print("Decode response: ", json.loads(response.text))

    # TODO See whether you need to alter this two output images
    im_name = os.path.basename(destination)
    im_name_out0 = im_name.split('.')[0] + '_out0.jpg'
    im_name_out1 = im_name.split('.')[0] + '_out1.jpg'
    im_name_out2 = im_name.split('.')[0] + '_out2.jpg'
    im_name_out3 = im_name.split('.')[0] + '_out3.jpg'
    processed_images = [im_name_out3, im_name_out0, im_name_out1, im_name_out2]
    # return render_template("grocery_gallery.html", image_names=processed_images)
    return json.dumps({'list': processed_images})


@material.route('/static', methods=['POST'])
def for_static():
    """ Logic to handle clicking on the existing images """

    global processed_images

    # decode request data
    r = request
    data = r.data

    # decode destination ?
    destination = jsonpickle.decode(data.decode('utf-8'))['image_list']

    data = {'image_list': os.path.join(conf.material['dir'], destination)}

    test_url = conf.material['url']

    # prepare the headers for http request
    content_type = 'application/json'
    headers = {'content-type': content_type}

    # send http request with iamge and receive responses
    response = requests.post(test_url, data=jsonpickle.encode(data), headers=headers)

    print("for static decode response : ", json.loads(response.text))

    im_name = os.path.basename(destination)
    im_name_out0 = im_name.split('.')[0] + '_out0.jpg'
    im_name_out1 = im_name.split('.')[0] + '_out1.jpg'
    im_name_out2 = im_name.split('.')[0] + '_out2.jpg'
    im_name_out3 = im_name.split('.')[0] + '_out3.jpg'
    processed_images = [im_name_out3, im_name_out0, im_name_out1, im_name_out2]
    print("********************")
    # return render_template("grocery_gallery.html", image_names=processed_images)
    return json.dumps({'list':processed_images})


