import os

import h5py
import numpy as np

from keras.preprocessing.image import Iterator
from kyu.engine.utils.data_utils import ClassificationImageData
from kyu.utils.dict_utils import load_dict


def crop_value(value, target_range):
    """
    Crop value and return the value cropped.

    Parameters
    ----------
    value
    target_range

    Returns
    -------

    """
    original_value = value
    value = value if value > target_range[0] else target_range[0]
    value = value if value < target_range[1] else target_range[1]
    residual = abs(original_value - value)
    return value, residual


class BoundingBox(object):
    center = (0,0)
    width = 0
    height = 0
    # Define the meta data
    image_width = 0
    image_height = 0

    def __init__(self, center, width, height, image_width=0, image_height=0, original_image_w=0, original_image_h=0):
        assert len(center) == 2
        self.center = (float(center[0]), float(center[1]))
        self.width = float(width)
        self.height = float(height)
        self.image_height = float(image_height)
        self.image_width = float(image_width)

        self.original_image_h = original_image_h
        self.original_image_w = original_image_w

    def set_image_parameter(self, height, width):
        self.image_width = width
        self.image_height = height

    # def transform_

    def plot_parameter_matplotlib(self, plot_size=(224, 224), canvas_shape=None, cornor=(0,0)):
        """
        Compute the plot bounding box for matplotlib.

        Parameters
        ----------
        plot_size
        canvas_shape : image reshape dimension
        cornor : cornor of the plot cutting size
        Returns
        -------

        """

        if canvas_shape is None:
            canvas_shape = plot_size
        aspect_ratio = [canvas_shape[0] / self.image_width, canvas_shape[1] / self.image_height]

        center_x = (self.center[0]) * aspect_ratio[0] - cornor[0]
        center_y = (self.center[1]) * aspect_ratio[1] - cornor[1]

        center_x, res_x = crop_value(center_x, (0, plot_size[0] - 1))
        center_y, res_y = crop_value(center_y, (0, plot_size[1] - 1))

        width = self.width * aspect_ratio[0] - res_x
        height = self.height * aspect_ratio[1] - res_y
        print(center_x, center_y, res_x, res_y, width, height)
        return (center_x, center_y), width, height


def decode_diseases(dis, dictionary):
    diseases = dis.split('|')
    if dis == 'No Finding':
        return []
    res = []
    for d in diseases:
        res.append(dictionary[d])
    return res


class ChestXray14Inference(ClassificationImageData):
    """ define the ChestXray pipeline """

    def __init__(self, dirpath='chestxray',
                 image_dir='images',
                 category='category.json',
                 config_file='Data_Entry_2017.h5',
                 boundingbox_file='BBox_List_2017.csv',
                 **kwargs):
        """

        Parameters
        ----------
        dirpath
        image_dir
        label_dir
        category
        config_file
        single_label : to become a binary classification problem!
        kwargs
        """
        super(ChestXray14Inference, self).__init__(root_folder=dirpath, image_dir=image_dir,
                                                   category=category, name='Chest-Xray-14',
                                                   **kwargs)
        self.config_file = config_file
        self.boundingbox_file = boundingbox_file
        self.build_image_label_lists()
        self.reset()

    def _build_category_dict(self):
        # Load category
        if self.category_path.endswith('json'):
            self.category_dict = load_dict(self.category_path)
            self.nb_class = len(self.category_dict)
        else:
            raise NotImplementedError
        self.category_dict['Infiltrate'] = 8
        return self.category_dict

    def absolute_image_path(self, path):
        """
        Input a relative path and get a absolute
        :param path:
        :return:
        """
        return os.path.join(self.image_folder, path)

    def build_image_label_lists(self):
        # For Inference, the output is defined as follow
        # It still output the target image, but with with different
        #
        try:
            fdata = h5py.File(os.path.join(self.root_folder, self.config_file), 'r+')
            # get the index
            self.id_bbindex = fdata['misc']['id_bbindex']
            self.boundingbox_entry = fdata['bb_raw']['entry']
            self.boundingbox_title = fdata['bb_raw']['title']
            self.image_entry = fdata['raw']['entry']
            self.id_entryindex = fdata['misc']['id_entryindex']

            # Get the image list
            self.image_list = [str(e)for e in self.id_bbindex]
            self.label_list = [self.image_entry[self.id_entryindex[e].value] for e in self.image_list]
            self.label_list = [l[1] for l in self.label_list]
            self.label_list = [decode_diseases(l, self.category_dict) for l in self.label_list]

            self.nb_sample = len(self.image_list)

        except IOError as e:
            raise NotImplementedError

    def reset(self):
        itr = Iterator(self.nb_sample, batch_size=1, shuffle=False, seed=0)
        self.index_generator = itr.index_generator

    def get_boundingbox(self, image_id):
        """
        Given the image ID (i.e., filename), generate the resulting bounding box.

        Parameters
        ----------
        image_id

        Returns
        -------

        """
        if not image_id.endswith('.png'):
            image_id = image_id + '.png'
        try:
            bb_list = [self.boundingbox_entry[e]for e in self.id_bbindex[image_id].value]
            img_entry = self.image_entry[self.id_entryindex[image_id].value]

            img_width, img_height = float(img_entry[7]), float(img_entry[8])
            result = []
            labels = []
            for bb in bb_list:
                bbox = BoundingBox(center=(float(bb[2]), float(bb[3])),
                                   height=float(bb[5]),
                                   width=float(bb[4]),
                                   image_width=1024,
                                   image_height=1024,
                                   original_image_w=img_width,
                                   original_image_h=img_height)
                labels.append(bb[1])
                result.append(bbox)

        except KeyError as e:
            print(e)
            return None, None, None
        return result, labels

    # def metadata_by_imageid(self, image_id):
    #     """
    #     Get the image meta
    #
    #     :param image_id:
    #     :return:
    #     """
    #

    def current(self, current_index):
        """
        Get the meta-data
        :return:
        """
        index = current_index
        fname = self.image_list[index]

        # load the label
        label = self.label_list[index]

        # load the corresponding bounding box
        bboxs, bb_labels = self.get_boundingbox(self.image_list[index])
        return fname, label, bboxs, bb_labels

    def update_index_list(self, force=False):
        """
        Update the config.misc.id_entryindex, id_bbindex

            Give a Image ID, get the result index, for bb entry and boundbox
        Returns
        -------
        None
        """
        if not force:
            return
        # For entry
        config = self.h5file
        entry = config['raw']['entry']
        entryind_label = 'id_entryindex'
        if not entryind_label in config['misc'].keys() or force:
            del config['misc'][entryind_label]
            id_entryindex = config['misc'].create_group(entryind_label)
            for ind, e in enumerate(entry):
                id_entryindex[e[0]] = ind
        else:
            id_entryindex = config['misc'][entryind_label]

        # For bounding box entry
        entry = config['bb_raw']['entry']
        entryind_label = 'id_bbindex'
        if not entryind_label in config['misc'].keys() or force:
            del config['misc'][entryind_label]
            id_bbindex = config['misc'].create_group(entryind_label)

            bb_list = [e[0] for e in entry]
            unique_flist = list(set(bb_list))
            bb_file_dicts = dict()
            for ind, fname in enumerate(unique_flist):
                bb_file_dicts[fname] = []
            for ind, e in enumerate(entry):
                bb_file_dicts[e[0]].append(ind)

            # Generate the unique list
            for key, item in bb_file_dicts.items():
                id_bbindex[key] = item
        else:
            id_bbindex = config['misc'][entryind_label]

    def label_to_nnlabel(self, label):
        """

        Parameters
        ----------
        label

        Returns
        -------

        """
        nnlabel = np.zeros((self.nb_class,))
        for i in label:
            nnlabel[i] = 1
        return nnlabel
