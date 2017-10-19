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


def read_file(path):
    with open(path, 'r') as f:
        return f.read()


def write_file(path, s):
    with open(path, 'w') as f:
        f.write(s)


def post_process(processed_text):
    processed_text = re.sub('\n+', '\n', processed_text)  # Multiple jumplines into 1 jumpline
    html_doc = processed_text.replace('\n', '</div><div class=start></br>')
    html_doc = html_doc.replace('<phrase>', '<span class=kp>')
    html_doc = html_doc.replace('</phrase>', '</span>')
    html_doc = '<div class=start>' + html_doc + '</div>'

    return html_doc