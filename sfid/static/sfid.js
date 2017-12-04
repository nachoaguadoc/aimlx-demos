ChatbotLayout.config(
    {
        sampleLink: "sfid/static/samples.json",
        textStartingConversation: 'Type a question or choose one of our samples.',
        submitFunction: submit
    }
);

function submit(input) {
    var data = {"input": removePunctuation(input).toLowerCase()};
    var url = "/sfid";
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function (data) {
            labels = data['labels'];
            intent = data['intent'];
            var formatedAnswer = formatAnswer(input, removePunctuation(input).toLowerCase(), labels, intent);
            ChatbotLayout.pushMessage(formatedAnswer, 'bot');

        }
    });
}

function removePunctuation(input) {
    return input.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
}

function formatAnswer(original, original_no_punctuation, labels, intent) {
    var formattedAnswer = '';

    labels_model = [labels];
    //labels_model = labels.split(" | ");

    for (var l in labels_model) {
        l = labels_model[l].split(" ");
        var original_splitted = original.split(" ");
        var original_splitted_np = original_no_punctuation.split(" ");
        var mainText = '';
        if (intent === 'restaurant') {
            intent = 'restaurants and food';
        }
        else if (intent === 'movie') {
            intent = 'movies';
        }
        else {
            intent = 'flights';
        }
        mainText = decorateMainText(intent);
        var json_like = '';
        for (i = 0; i < l.length; i++) {
            if (l[i] !== "O") {
                if (l[i].toLowerCase().substring(0, 1) == 'b') {
                    json_like += '</p><p class="speech-buble-text">' + l[i].toLowerCase().substring(2, l[i].length) + ': ' + ' <span class="text-highlight">' + original_splitted_np[i] + ' </span>';
                }
                else {
                    json_like += '<span class="text-highlight">' + original_splitted_np[i] + ' </span>';
                }
            }
        }
        if (json_like !== '') {
            return mainText + decorateInfo(json_like);
        } else {
            return mainText;
        }
    }
}

function decorateMainText(intent) {
    var markupHighlightedIntent = '<span class="text-highlight">' + intent + '</span>';
    var answerList = [
        'Did you know that answering ' + markupHighlightedIntent + ' questions is my specialty? ;-)',
        'I love your question about ' + markupHighlightedIntent + ' ... :-)',
        'This is like the zillion-th question you ask me about ' + markupHighlightedIntent + ' ...',
        'Huh... this is the strangest question about ' + markupHighlightedIntent + ' I have ever been asked ...'
    ];
    var randomNumber = Math.ceil(Math.random() * (answerList.length - 1));
    return ('<p>' + answerList[randomNumber] + '</p>');
}

function decorateInfo(data) {
    return '<div class="detected-information"><p class="text-label">I will make an API call with this detected information' + data + '</div>'
}
