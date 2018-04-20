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
    console.log(lang, answers);

    if(label === 1) {
        sentence = answers[lang]['churn'][0];
        brand_color = joinWithColor([brand], 'red');
    } else {
        sentence = answers[lang]['no_churn'][0];
        brand_color = joinWithColor([brand], 'green');
    }

    console.log(sentence, brand_color)
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

function submit(input) {
    var url = "/churn";
    var data = {"input": input};
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function (data) {

            data = JSON.parse(data);

            if(data["lang"] !== undefined && data["label"] !== undefined && data["brand"] !== undefined) {
                // Non proper response, ask for new text
                ChatbotLayout.pushMessage(formatAnswer(data["label"], data["brand"], data["lang"]),
                    'bot', getEmotion(data["label"]));
            } else if (data["msg"] !== undefined && data["lang"] !== undefined) {
                // console.log(answers[data["lang"]]);
                ChatbotLayout.pushMessage(answers[data["lang"]]['msg'][data["msg"]], 'bot', 'smile')
            } else {
                ChatbotLayout.pushMessage('I was not designed to do this', 'bot', 'no_answer')
            }

        }
    });
}
