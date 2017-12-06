#!/usr/bin/env python

"""
Demo build Material example.

Take a input image
    Pre-process with the keras function, display the results in out1
    Generate the first-order and second-order comparison on the top-1 predict class,
        display the result in out2.

Return the corresponding prediction result in the encoded json list.

"""
# General import
import os
import sys
import numpy as np
import h5py
from flask import Flask, request, Response
import jsonpickle
import json
# TODO set corresponding python plot environment? if necessary
import matplotlib.pyplot as plt
import matplotlib.cm as cm


# import those self related objects
from keras import activations

import keras.backend as K
from keras.models import load_model, model_from_json
from keras.preprocessing.image import load_img, img_to_array
from kyu.utils.image import ImageDataGeneratorAdvanced
from kyu.utils.imagenet_utils import preprocess_image_for_imagenet_without_channel_reverse
from kyu.layers import get_custom_objects
from models.cvlab_demo.utils import get_top_k_classification
from vis.visualization import visualize_cam, overlay
from vis.utils import utils

app = Flask(__name__)

plt.rcParams['figure.figsize'] = (4, 4)
# plt.rcParams['font.size'] = 12
# plt.rcParams['axes.titlesize'] = 'large'
# plt.rcParams['line.width'] = 4

VGG_GSP_MINC_PATH = 'material/VGG16_GSP_model.hdf5'

VGG_GAP_PATH = 'material/VGG16_GAP_keras.config'
VGG_GAP_WEIGHT = 'material/VGG16_GAP_model.weight'

# Define the global variable always exists
fo_model = None
orig_fo_model = None
so_model = None
orig_so_model = None
fo_layer_idx = 0
so_layer_idx = 0

hand_picked_list = ['hair_002342.jpg', 'hair_002288.jpg', 'hair_001590.jpg',
                    'food_002488.jpg', 'food_001650.jpg', 'food_000590.jpg',
                    'plastic_002427.jpg', 'fabric_001424.jpg', 'paper_001043.jpg'
                    'mirror_002111.jpg'
                    ]

minc_image_gen = ImageDataGeneratorAdvanced(
    (224, 224), 256,
    preprocessing_function=preprocess_image_for_imagenet_without_channel_reverse)


def decode_minc_nnid(nnid):
    """
    Define the minc nnid
    :param nnid:
    :return:
    """
    # APP_ROOT = os.path.dirname(os.path.abspath(__file__))
    CATEGORY = 'material/categories.txt'
    if not os.path.exists(CATEGORY):
        return None
    with open(CATEGORY, 'r') as f:
        cate_list = f.read().splitlines()
    return cate_list[nnid]


def preprocess_image_for_minc(img):
    """
    Input the image, mimic the ImageIterator
    :param img: PIL Image object
    :return: np.ndarray preprocessed image
    """
    x = img_to_array(img)
    x = minc_image_gen.advancedoperation(x)
    x = x.astype(K.floatx())
    x = minc_image_gen.standardize(x)
    return x


def process_image_and_display_result(image):
    """
    Give the input image, get corresponding result.

    :param image:
    :return:
    """

    print("image {}".format(image))
    original_image = load_img(image)
    img = load_img(image)
    original_resize = load_img(image)
    original_resize = img_to_array(original_resize)
    original_resize = original_resize.astype(K.floatx())
    original_resize = minc_image_gen.advancedoperation(original_resize)

    # Process the image accordingly
    x = preprocess_image_for_minc(img)

    # Save the preprocessed image and original image into
    f, ax = plt.subplots(1,1)
    ax.imshow(x)
    ax.set_title("Preprocessed image", fontsize='x-large')
    output_path = image.split('.')[0] + '_out0.jpg'
    plt.savefig(output_path)

    # Get prediction results
    top_k = 5
    fo_result = get_top_k_classification(orig_fo_model, x, k=top_k)
    so_result = get_top_k_classification(orig_so_model, x, k=top_k)
    print("First order result {} \n Second order result {}".format(
        fo_result, so_result))

    # Plot FO results
    f, ax = plt.subplots(1,1)
    grads = visualize_cam(fo_model, fo_layer_idx,
                          filter_indices=fo_result[0][0][top_k-1], seed_input=x)
    jet_heatmap = np.uint8(cm.jet(grads)[...,:3] * 255)
    ax.imshow(overlay(jet_heatmap, original_resize))
    ax.set_title("Label: {} \n Prob: {}".format(
        decode_minc_nnid(fo_result[0][0][-1]),
        fo_result[1][0][-1]),
        fontsize='x-large'
    )
    # ax.set_title("Label: {} \n Prob: {}".format(
    #     decode_minc_nnid(fo_result[0][0][-1]),
    #     fo_result[1][0][-1])
    # )
    output_path = image.split('.')[0] + '_out1.jpg'
    plt.savefig(output_path)

    f, ax = plt.subplots(1, 1)
    # Plot SO results
    grads = visualize_cam(so_model, so_layer_idx,
                          filter_indices=so_result[0][0][top_k - 1], seed_input=x)
    jet_heatmap = np.uint8(cm.jet(grads)[..., :3] * 255)
    ax.imshow(overlay(jet_heatmap, original_resize))
    ax.set_title("Label: {} \n Prob: {}".format(
        decode_minc_nnid(so_result[0][0][-1]),
        so_result[1][0][-1]), fontsize='x-large'
    )
    output_path = image.split('.')[0] + '_out2.jpg'
    plt.savefig(output_path)
    return fo_result, so_result


@app.route('/material/process', methods=['POST'])
def test():
    """
    All the logic of prediction of image, happens here!
    Including the load image
    test result

    :return:
    """
    r = request
    data = r.data
    data_dict = jsonpickle.decode(data.decode('utf-8'))

    print("Processing image {}.".format(data_dict['image_list']))

    results = process_image_and_display_result(data_dict['image_list'])

    # Formulate the prediction result
    response = {'message': 'done',
                'FO': results[0],
                'SO': results[1]}
    response_pickled = jsonpickle.encode(response)
    return Response(response=response_pickled, status=200, mimetype='application/json')


if __name__ == '__main__':
    # declare and load the first-order and second-order model
    global fo_model, orig_fo_model
    global so_model, orig_so_model
    global minc_image_gen
    global so_layer_idx, fo_layer_idx

    print("Start loading the models ")
    with open(VGG_GAP_PATH, 'r') as f:
        f_json = json.load(f)

    fo_model = model_from_json(f_json)
    fo_model.load_weights(VGG_GAP_WEIGHT)

    orig_fo_model = model_from_json(f_json)
    orig_fo_model.load_weights(VGG_GAP_WEIGHT)

    so_model = load_model(VGG_GSP_MINC_PATH, custom_objects=get_custom_objects())
    orig_so_model = load_model(VGG_GSP_MINC_PATH, custom_objects=get_custom_objects())

    print("Finish loading the models with following summarys")
    fo_model.summary()
    so_model.summary()

    print("Begin to create visualization models ")

    so_layer_idx = utils.find_layer_idx(so_model, 'dense_1')
    so_model.layers[so_layer_idx].activation = activations.linear
    so_model = utils.apply_modifications(so_model, custom_objects=get_custom_objects())

    fo_layer_idx = utils.find_layer_idx(fo_model, 'new_pred')
    fo_model.layers[fo_layer_idx].activation = activations.linear
    fo_model = utils.apply_modifications(fo_model)

    # Wrapped with Guided gradient operations
    from vis.backprop_modifiers import guided
    so_model = guided(so_model)
    fo_model = guided(fo_model)
    print("Finish model creation, you can start prediction ... ")
    app.run(host='0.0.0.0', port=6135)
