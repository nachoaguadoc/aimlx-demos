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
    var brand_color = '';

    if(label === 1) {
        sentence = answers[lang]['churn'];
        brand_color = joinWithColor([brand], 'red');
    } else {
        sentence = answers[lang]['no_churn'];
        brand_color = joinWithColor([brand], 'green');
    }

    return sentence.replace('{}', brand_color)

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
        textStartingConversation: 'Try to fool me! Enter a sentence (EN/DE) that is either churny or non churny !',
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
            '<p>' + formatAnswer(label, brand, lang) + '</p>',
                    'bot', getEmotion(label));
    }
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