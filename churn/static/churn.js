// Loading answers to reply to user
var answers = [];
$.getJSON("churn/static/answers.json", function(json) {
    answers = json; // this will show the info it in firebug console
});

function getEmotion(label) {
    var sentiment = 'smile';

    if(label === 1) {
        sentiment = 'angry'
    }

    return sentiment
}

function formatAnswer(label, brand, lang) {

    var sentence = '{}';

    if(label === 1) {
        if(brand === '') {
            sentence = answers[lang]['churn_no_brand'];
        } else {
            sentence = answers[lang]['churn'];
            sentence = sentence.replace('{}', joinWithColor([brand], 'red'))
        }

    } else {
        if(brand === '') {
            sentence = answers[lang]['no_churn_no_brand'];
        } else {
            sentence = answers[lang]['no_churn'];
            sentence = sentence.replace('{}', joinWithColor([brand], 'green'))
        }
    }

    return sentence

}

function joinWithColor(brands, color) {

    var data = [];
    for (var i = 0; i < brands.length; ++i) {
      var t = capitalizeFirstLetter(brands[i]);
      data.push('<span class="font--semi-bold int-' + color + '">' + t + '</span>')
    }

    return data.join('/')

}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

ChatbotLayout.config(
    {
        sampleLink: "churn/static/samples.json",
        textStartingConversation: 'Enter a sentence (EN/DE) that is either churny or non churny. Try to be creative :)!',
        submitFunction: submit
    }
);

var lang = 'EN';
var churn = null;
var input_text = '';
var STATE = 'input';

function submit(input) {

    // Send message and wait for answer
    if(STATE === 'input') {
        get_prediction(input)
    } else {
        set_prediction(input)
    }
}

function post_next_msg() {

    if(churn !== null && churn.length === 0) {
        STATE = 'input'
    }

    // Send message and wait for answer
    if(STATE === 'input') {
        ChatbotLayout.pushMessage('<p>' + answers[lang]['next'] + '</p>', 'bot', 'smile');
    } else {
        var id_next = churn.length - 1;
        var brand = churn[id_next][0];
        var label = churn[id_next][1];

        ChatbotLayout.pushMessage(
            '<p>' + formatAnswer(label, brand, lang) + '</p>', 'bot', getEmotion(label));

        // Add feed back
        ChatbotLayout.pushMessage(
            '<div class="button-group button-group--fill" style="inline-flex">' +
                '<button onclick="answer_button(1)" class="button button--confirm" type="submit"><i class="fa fa-check-circle "></i></button> ' +
                '<button onclick="answer_button(0)" class="button button--secondary" type="submit"><i class="fa fa-times-circle"></i></button> ' +
            '</div>'
            , 'bot', getEmotion(label));
    }
}

function answer_button(label) {

    $('#chat-data .button--confirm').last().addClass('disabled');
    $('#chat-data .button--confirm').last().attr("onclick","");
    $('#chat-data .button--secondary').last().addClass('disabled');
    $('#chat-data .button--secondary').last().attr("onclick","");

    var msg = answers[lang]['yes'];
    if(label === 0) {
        msg = answers[lang]['no'];
    }
    ChatbotLayout.pushMessage(
            '<p>' + msg + '</p>', 'client', '');
    submit(msg)
}



function set_prediction(input) {
    if (['yes', 'yeah', 'ja', 'yup'].indexOf(input.toLowerCase()) >= 0) {
        // Is right
        ChatbotLayout.pushMessage('<p>' + answers[lang]['not_fooled'] + '</p>', 'bot', 'smile');
        console.log(churn[churn.length - 1][1]);
        send_label(input_text, churn[churn.length - 1][0], churn[churn.length - 1][1], lang);
        churn.pop();
    } else if(['no', 'nope', 'nein'].indexOf(input.toLowerCase()) >= 0) {
        // Is wrong
        ChatbotLayout.pushMessage('<p>' + answers[lang]['fooled'] + '</p>', 'bot', 'angry');
        console.log(churn[churn.length - 1][1]);
        console.log(1-churn[churn.length - 1][1]);
        send_label(input_text, churn[churn.length - 1][0], 1-churn[churn.length - 1][1], lang);
        churn.pop();
    } else {
        // Unknown
        ChatbotLayout.pushMessage('<p>' + answers[lang]['unknown'] + '</p>', 'bot', 'no_answer')
    }

    post_next_msg()

}

function get_prediction(input) {
    var url = "/churn/get_prediction";
    var data = {"input": input};
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function (data) {

            data = JSON.parse(data);
            // Save new data
            STATE = 'labelling';
            input_text = input;
            if(data["lang"] !== undefined) {
                lang = data["lang"]
            }
            if(data["churn"] !== undefined) {
                churn = data["churn"]
            }

            console.log('Process', input_text, 'in', lang, '\n', churn);

            post_next_msg()
        }
    });
}

function send_label(text, brand, label, lang) {
    var url = "/churn/send_label";
    var data = {"text": text, "lang": lang, "brand": brand, "label": label};
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function (data) {
        }
    });
}