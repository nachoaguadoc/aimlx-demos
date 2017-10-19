def encode_sth(item):
    coding = ['iso-8859-1', 'utf8', 'latin1', 'ascii']
    for coding_format in coding:
        try:
            coded = item.encode(coding_format)
            return coded
        except:
            continue
    raise Exception('Unable to encode', item)


def decode_sth(item):
    coding = ['iso-8859-1', 'utf8', 'latin1', 'ascii']
    for coding_format in coding:
        try:
            coded = item.decode(coding_format)
            return coded
        except:
            continue
    raise Exception('Unable to decode', item)

# Opinion target route handling
def parse_output(output_path):
    f = open(output_path, 'r')
    pred_labels = []
    for line in f:
        line = line.strip()
        if len(line.split()) == 3:
            pred_label = line.split()[2]
            pred_labels.append(pred_label)
    return " ".join(pred_labels)


def parse_input(input, file):
    f = open(file, "w")
    tokens = [token for token in input.split()]
    for token in tokens:
        f.write(token + " O\n")

