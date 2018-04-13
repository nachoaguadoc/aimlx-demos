import os
import pandas as pd
import numpy as np
import yaml


def update_db_tweet(data, struct, dir_labels):

    # CHeck if all tags present in data
    tags = ['db_info', 'label', 'brand', 'id_tweet']
    if any([tag not in data for tag in tags]):
        return

    filename = struct[data['db_info']]['file']
    file_path = os.path.join(dir_labels, filename)

    df = pd.read_csv(file_path, sep='\t', encoding='utf-8', error_bad_lines=False,
                     dtype={'id': str}, warn_bad_lines=False)
    df.set_index('id', inplace=True)

    try:
        df.loc[data['id_tweet'], 'brand'] = data['brand']
        df.loc[data['id_tweet'], 'label'] = data['label']
    except Exception as e:
        print(e)
        pass

    df.reset_index().to_csv(file_path, index=False, sep='\t', encoding='utf-8', float_format='%20.f')


def get_db_tweet(db_name, struct, dir_labels, id_tweet=None):
    # Read which file to label

    db_info = struct[db_name]

    # Take a row to label in the file
    file_path = os.path.join(dir_labels, db_info['file'])
    df = pd.read_csv(file_path, sep='\t', encoding='utf-8', error_bad_lines=False,
                     dtype={'id': str}, warn_bad_lines=False)

    id_null = pd.isnull(df['label'])
    n = np.sum(id_null).astype(int)
    if n == 0:
        return None

    # Get specific tweet
    if id_tweet is not None:
        row = df.loc[id_tweet == df['id']]
        print(row)
        print(len(row))
        row = row.iloc[0]
        print(row)
    # Get next tweet
    else:
        row = df.loc[id_null].iloc[np.random.randint(n)]

    # Form dict to send tweet
    data = {'id_tweet': row['id'], 'db_info': db_name,
            'full_text': row['full_text'], 'brand': row['brand'],
            'labels': struct[db_name]['labels'],
            'name': db_info['name'], 'n_lab': len(df)-n, 'n_tot': len(df)}
    return data


def get_stat_number(struct, dir_labels):
    for db in struct:
        try:
            file_path = os.path.join(dir_labels, struct[db]['file'])
            df = pd.read_csv(file_path, sep='\t', encoding='utf-8', usecols=['label'],
                             error_bad_lines=False, warn_bad_lines=False)
            struct[db]['n_tot'] = len(df)
            struct[db]['n_lab'] = len(df)-np.sum(pd.isnull(df['label']))
        except Exception as e:
            pass
    return struct


def get_yml_info(dir_labels):
    file_info = os.path.join(dir_labels, 'info.yml')
    stram = open(file_info, "r")
    return yaml.load(stram)