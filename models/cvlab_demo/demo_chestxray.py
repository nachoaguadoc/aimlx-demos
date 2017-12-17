#!/usr/bin/env python

"""
Demo build Chest-xray example.

Take a input image
    Pre-process with the keras function, display the results in out0
    Generate the first-order and second-order comparison on the top-1 predict class,
        display the result in out1,2.
    Original-resized image is stored in out3

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
import matplotlib.patches as patches


# import those self related objects
from keras import activations

import keras.backend as K
from keras.models import load_model, model_from_json
from keras.preprocessing.image import load_img, img_to_array
from kyu.utils.dict_utils import load_dict, merge_dicts
from kyu.utils.image import ImageDataGeneratorAdvanced
from kyu.utils.imagenet_utils import preprocess_image_for_imagenet_without_channel_reverse
from kyu.configs.experiment_configs.running_configs import preprocess_image_for_chestxray,\
    get_custom_metrics_objects_for_chest
from kyu.layers import get_custom_objects
from models.cvlab_demo.datasets_chestxray import ChestXray14Inference
from models.cvlab_demo.utils import get_top_k_classification
from vis.visualization import visualize_cam, overlay
from vis.utils import utils


app = Flask(__name__)

plt.rcParams['figure.figsize'] = (4,4)

# Version 2, 2017-11-30
RESNET_FO_PATH = 'chestxray/resnet50_fo_keras.config'
RESNET_FO_WEIGHT = 'chestxray/resnet50_fo_weights.h5'

# Version 3. Finetune on FO
RESNET_GSP_MODEL_PATH = 'chestxray/resnet50_so_model-2.h5'
RESNET_GSP_WEIGHT = 'chestxray/resnet50_so_weights-2.h5'

local_dir = '/Users/kcyu/git/aimlx-demos/static/assets/chestxray_images/'
dataset_dir = '/Users/kcyu/mount/cvlabdata/chest-xray14/images/'

# chest_category = load_dict('chestxray/categories.json')
dataset = ChestXray14Inference()
chest_category = dataset.category_dict

cate_list = None
hand_picked_list = ['00012141_013.png']

# global chestxray_image_gen

chestxray_image_gen = ImageDataGeneratorAdvanced(
    (224, 224), 256, preprocessing_function=preprocess_image_for_chestxray
    # (224, 224), 256, preprocessing_function=preprocess_image_for_imagenet_without_channel_reverse
)

# declare and load the first-order and second-order model
# global fo_model, orig_fo_model
# global so_model, orig_so_model
#
# global so_layer_idx, fo_layer_idx
# global fo_penulitimate_layer_idx
# global so_penulitimate_layer_idx
print("Start loading the models ")
with open(RESNET_FO_PATH, 'r') as f:
    f_json = json.load(f)

fo_model = model_from_json(f_json)
fo_model.load_weights(RESNET_FO_WEIGHT)

orig_fo_model = model_from_json(f_json)
orig_fo_model.load_weights(RESNET_FO_WEIGHT)

so_model = load_model(RESNET_GSP_MODEL_PATH,
                      custom_objects=merge_dicts(get_custom_objects(), get_custom_metrics_objects_for_chest()))
orig_so_model = load_model(RESNET_GSP_MODEL_PATH,
                           custom_objects=merge_dicts(get_custom_objects(), get_custom_metrics_objects_for_chest()))

so_model.metrics = [so_model.metrics[0]]
orig_so_model.metrics = [orig_so_model.metrics[0]]

print("Finish loading the models with following summarys")
fo_model.summary()
so_model.summary()

print("Begin to create visualization models ")

so_layer_idx = utils.find_layer_idx(so_model, 'dense_1')
so_penulitimate_layer_idx = utils.find_layer_idx(so_model, '1x1_conv_0')
so_model.layers[so_layer_idx].activation = activations.linear
so_model = utils.apply_modifications(so_model, custom_objects=get_custom_objects())

fo_layer_idx = utils.find_layer_idx(fo_model, 'new_pred')
fo_penulitimate_layer_idx = utils.find_layer_idx(fo_model, 'add_16')
fo_model.layers[fo_layer_idx].activation = activations.linear
fo_model = utils.apply_modifications(fo_model)

# Wrapped with Guided gradient operations
# from vis.backprop_modifiers import guided
# so_model = guided(so_model)
# fo_model = guided(fo_model)
print("Finish model creation, you can start prediction ... ")


def decode_chestxray_nnid(nnid):
    """
    Define the chest-xray nnid decoder

    :param nnid:
    :return:
    """
    global cate_list
    if cate_list is None:
        CATEGORY = 'chestxray/category.txt'
        if not os.path.exists(CATEGORY):
            return None
        with open(CATEGORY, 'r') as f:
            cate_list = f.read().splitlines()
        cate_list = [l.split(',')[0] for l in cate_list]
    return cate_list[nnid]


def preprocess_image_for_chestxray_loader(img):
    x = img_to_array(img)
    x = chestxray_image_gen.advancedoperation(x)
    x = x.astype(K.floatx())
    x = chestxray_image_gen.standardize(x)
    return x


def draw_boundingbox(ax, bboxs, labels=None):
    # Draw the bounding box
    for ind, bb in enumerate(bboxs):
        b = bb.plot_parameter_matplotlib(canvas_shape=(256, 256), cornor=(16, 16))
        rect = patches.Rectangle(b[0], b[1], b[2], linewidth=3, edgecolor='r', fill=False)
        ax.add_patch(rect)
        # potentially add the labels in the future and color map
        if labels:
            ax.annotate(labels[ind], b[0], color='r', weight='bold', fontsize=8, ha='left', va='bottom')
    return ax


def draw_original_boundingbox(ax, bboxs, labels=None):
    # Draw the bounding box
    for ind, bb in enumerate(bboxs):
        b = bb.plot_parameter_matplotlib(plot_size=(1024, 1024), canvas_shape=(1024, 1024), cornor=(0, 0))
        rect = patches.Rectangle(b[0], b[1], b[2], linewidth=3, edgecolor='r', fill=False)
        print('original bounding box : {},{}, {}'.format(b[0], b[1], b[2]))
        ax.add_patch(rect)
        # potentially add the labels in the future and color map
        if labels:
            ax.annotate(labels[ind], b[0], color='r', weight='bold', fontsize=8, ha='left', va='bottom')

    return ax


def process_image_and_display_result(image):
    """
    Give the input image id, generate the corresponding pre-processed image,
    and prediction results.

    Stored in the out0-3.jpg
    """

    # Set the image ID
    image_id = image.split('/')[-1]
    print("image {} \n image id {}".format(image, image_id))

    original_image = load_img(image)
    img = load_img(image)
    # Process the image accordingly
    x = preprocess_image_for_chestxray_loader(img)

    # have the original image
    original_resize = load_img(image)
    original_resize = img_to_array(original_resize)
    original_resize = original_resize.astype(K.floatx())
    original_resize = chestxray_image_gen.advancedoperation(original_resize)

    # get the corresponding ids
    bboxs, bb_labels = dataset.get_boundingbox(image_id)
    draw_bbox = True if bboxs is not None else False
    print(bboxs, bb_labels)
    bb_gtind = dataset.category_dict[bb_labels[0]]

    # Save the preprocessed image and original image into
    f, ax = plt.subplots(1, 1)
    ax.imshow(original_resize)
    if draw_bbox:
        ax = draw_boundingbox(ax, bboxs, labels=bb_labels)
    ax.set_title("Original image", fontsize='x-large')
    output_path = image.split('.')[0] + '_out3.jpg'
    plt.savefig(output_path)

    # Save the preprocessed image and original image into
    f, ax = plt.subplots(1, 1)
    ax.imshow(x)
    if draw_bbox:
        ax = draw_boundingbox(ax, bboxs, labels=bb_labels)
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
    f, ax = plt.subplots(1, 1)
    grads = visualize_cam(fo_model, fo_layer_idx,
                          filter_indices=bb_gtind, seed_input=x,
                          penultimate_layer_idx=fo_penulitimate_layer_idx-1)
    jet_heatmap = np.uint8(cm.jet(grads)[..., :3] * 255)
    ax.imshow(overlay(jet_heatmap, original_resize))
    if draw_bbox:
        ax = draw_boundingbox(ax, bboxs, labels=bb_labels)
    ax.set_title("Label: {} \n Prob: {}".format(
        decode_chestxray_nnid(bb_gtind),
        fo_result[1][0][-1]),
        fontsize='x-large'
    )
    ax.set_xlabel("Baseline", fontsize='x-large')
    # ax.set_title("Label: {} \n Prob: {}".format(
    #     decode_minc_nnid(fo_result[0][0][-1]),
    #     fo_result[1][0][-1])
    # )
    output_path = image.split('.')[0] + '_out1.jpg'
    plt.savefig(output_path)

    f, ax = plt.subplots(1, 1)
    # Plot SO results
    grads = visualize_cam(so_model, so_layer_idx,
                          filter_indices=bb_gtind, seed_input=x,
                          penultimate_layer_idx=so_penulitimate_layer_idx-1)
    jet_heatmap = np.uint8(cm.jet(grads)[..., :3] * 255)
    ax.imshow(overlay(jet_heatmap, original_resize))
    if draw_bbox:
        ax = draw_boundingbox(ax, bboxs, labels=bb_labels)
    ax.set_title("Label: {} \n Prob: {}".format(
        decode_chestxray_nnid(bb_gtind),
        so_result[1][0][-1]), fontsize='x-large'
    )
    ax.set_xlabel("Ours", fontsize='x-large')
    output_path = image.split('.')[0] + '_out2.jpg'
    plt.savefig(output_path)
    return fo_result, so_result


def process_image_and_display_result_for_one(image):
    """
    Give the input image id, generate the corresponding pre-processed image,
    and prediction results.

    Stored in the out0-3.jpg
    """

    # Set the image ID
    image_id = image.split('/')[-1]
    print("image {} \n image id {}".format(image, image_id))

    original_image = load_img(image)
    img = load_img(image)
    # Process the image accordingly
    x = preprocess_image_for_chestxray_loader(img)

    # have the original image
    original_resize = load_img(image)
    original_resize = img_to_array(original_resize)
    original_resize = original_resize.astype(K.floatx())
    original_resize = chestxray_image_gen.advancedoperation(original_resize)

    # get the corresponding ids
    bboxs, bb_labels = dataset.get_boundingbox(image_id)
    draw_bbox = True if bboxs is not None else False
    print(bboxs, bb_labels)
    bb_gtind = dataset.category_dict[bb_labels[0]]

    # Save the preprocessed image and original image into
    f, ax = plt.subplots(2, 2)
    ax[0,0].imshow(original_resize)
    if draw_bbox:
        ax[0,0] = draw_boundingbox(ax[0,0], bboxs, labels=bb_labels)
    ax[0,0].set_title("Original image", fontsize='x-large')
    output_path = image.split('.')[0] + '_out3.jpg'
    # plt.savefig(output_path)

    # Save the preprocessed image and original image into
    # f, ax = plt.subplots(1, 1)
    ax[0,1].imshow(x)
    if draw_bbox:
        ax[0,1] = draw_boundingbox(ax[0,1], bboxs, labels=bb_labels)
    ax[0,1].set_title("Preprocessed image", fontsize='x-large')
    output_path = image.split('.')[0] + '_out0.jpg'
    # plt.savefig(output_path)

    # Get prediction results
    top_k = 5
    fo_result = get_top_k_classification(orig_fo_model, x, k=top_k)
    so_result = get_top_k_classification(orig_so_model, x, k=top_k)
    print("First order result {} \n Second order result {}".format(
        fo_result, so_result))

    # Plot FO results
    # f, ax = plt.subplots(1, 1)
    grads = visualize_cam(fo_model, fo_layer_idx,
                          filter_indices=bb_gtind, seed_input=x,
                          penultimate_layer_idx=fo_penulitimate_layer_idx-1)
    jet_heatmap = np.uint8(cm.jet(grads)[..., :3] * 255)
    ax[1,0].imshow(overlay(jet_heatmap, original_resize))
    if draw_bbox:
        ax[1,0] = draw_boundingbox(ax[1,0], bboxs, labels=bb_labels)
    ax[1,0].set_title("Label: {} \n Prob: {}".format(
        decode_chestxray_nnid(bb_gtind),
        fo_result[1][0][-1]),
        fontsize='x-large'
    )
    ax[1,0].set_xlabel("Baseline", fontsize='x-large')
    # ax.set_title("Label: {} \n Prob: {}".format(
    #     decode_minc_nnid(fo_result[0][0][-1]),
    #     fo_result[1][0][-1])
    # )
    output_path = image.split('.')[0] + '_out1.jpg'
    # plt.savefig(output_path)

    # f, ax = plt.subplots(1, 1)
    # Plot SO results
    grads = visualize_cam(so_model, so_layer_idx,
                          filter_indices=bb_gtind, seed_input=x,
                          penultimate_layer_idx=so_penulitimate_layer_idx-1)
    jet_heatmap = np.uint8(cm.jet(grads)[..., :3] * 255)
    ax[1,1].imshow(overlay(jet_heatmap, original_resize))
    if draw_bbox:
        ax[1,1] = draw_boundingbox(ax[1,1], bboxs, labels=bb_labels)
    ax[1,1].set_title("Label: {} \n Prob: {}".format(
        decode_chestxray_nnid(bb_gtind),
        so_result[1][0][-1]), fontsize='x-large'
    )
    ax[1,1].set_xlabel("Ours", fontsize='x-large')
    output_path = image.split('.')[0] + 'result.jpg'
    plt.savefig(output_path)

    return fo_result, so_result


@app.route('/chestxray/process', methods=['POST'])
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

    app.run(host='0.0.0.0', port=6130)

    # prediction
    # for i in range(0, 10):
    #     process_image_and_display_result_for_one(local_dir + dataset.image_list[i])
