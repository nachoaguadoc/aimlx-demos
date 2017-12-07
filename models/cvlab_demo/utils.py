import numpy as np

# Obtain the prediction
from keras.preprocessing.image import img_to_array
from kyu.utils.image import ImageDataGeneratorAdvanced
from vis.visualization import visualize_cam, overlay
import matplotlib.cm as cm
import os
import keras.backend as K


def preprocess_image_for_chestxray(img):
    """
        Preprocess Image for CUB dataset

        ,
        ,
        108.68376923,
        :param img: ndarray with rank 3
        :return: img: ndarray with same shape

        """
    mean = 108
    data_format = K.image_data_format()
    assert data_format in {'channels_last', 'channels_first'}
    x = img
    if data_format == 'channels_first':
        # Zero-center by mean pixel
        x[0, :, :] -= mean
        x[1, :, :] -= mean
        x[2, :, :] -= mean
    else:
        # Zero-center by mean pixel
        x[:, :, 0] -= mean
        x[:, :, 1] -= mean
        x[:, :, 2] -= mean
    return x


def get_top_k_classification(model, seed_input, k=5):
    """
    Get top k prediction results

    :param model:
    :param seed_input:
    :param k:
    :return: top_k_preds, top_k_probs
    """

    if np.ndim(seed_input) == 3:
        seed_input = np.expand_dims(seed_input, 0)
    predictions = model.predict(seed_input)

    top_k_preds = [list(i[-k:]) for i in np.argsort(predictions)]
    top_k_probs = [[predictions[j][i] for i in top_k_preds[j]] for j in range(predictions.shape[0])]
    # print(top_k_preds)
    # print(top_k_probs)
    return top_k_preds, top_k_probs


def show_top_k_CAM(plt, model, layer_idx, result, top_k, img, original_img, label, modifier=None, title=""):
    """

    :param plt: matplotlib.pyplot object
    :param model: keras model
    :param layer_idx: layer index
    :param result: prediction results
    :param top_k: index of top K
    :param img: preprocessed image
    :param original_img: original image to be displayed
    :param label:
    :param modifier:
    :param title:
    :return:
    """
    size = 6
    col = 3
    # determine the number of axis
    row = (top_k + 1) / col
    plt.rcParams['figure.figsize'] = (size * col, size * row)
    plt.figure()
    f, ax = plt.subplots(row, col)
    plt.suptitle("{} Modifier {}".format(title, modifier))
    ax[0][0].imshow(original_img)
    ax[0][0].set_title("Ground Truth: {}".format(decode_minc_nnid(np.argmax(label))))
    for i in range(1, top_k + 1):
        # plot the original image
        filter_indice = result[0][0][top_k - i]
        grads = visualize_cam(model, layer_idx, filter_indices=filter_indice,
                              seed_input=img, backprop_modifier=modifier)
        jet_heatmap = np.uint8(cm.jet(grads)[..., :3] * 255)
        ax[i / col][i % col].imshow(overlay(jet_heatmap, original_img))
        ax[i / col][i % col].set_title(
            "label:{}\n prob:{}".format(decode_minc_nnid(filter_indice), result[1][0][top_k - i]))

    return plt

