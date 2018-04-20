// Loading answers to reply to user
var answers = [];
$.getJSON("churn/static/answers.json", function(json) {
    answers = json; // this will show the info it in firebug console
});

// function getEmotion(results) {
//     var sentiment = 'smile';
//
//     // No brands are detected
//     if(results['churn_b'].length === 0 && results['nochurn_b'].length === 0 ) {
//         sentiment = 'no_answer';
//     }
//
//     // No churn detected
//     if(results['churn_b'].length === 0 && results['nochurn_b'].length !== 0) {
//         sentiment = 'smile';
//     }
//
//     // At least one churn detected
//     if(results['churn_b'].length !== 0) {
//         sentiment = 'angry';
//     }
//
//     return sentiment
// }

// function formatAnswer(results) {
//
//     var txt = '';
//     var lang = results['lang'];
//
//     // No brands are detected
//     if(results['churn_b'].length === 0 && results['nochurn_b'].length === 0 ) {
//         var tmp = answers[lang]['nothing'];
//         return tmp[getRandomInt(tmp.length)];
//     }
//
//     // No churn detected
//     if(results['churn_b'].length === 0 && results['nochurn_b'].length !== 0) {
//         var tmp = answers[lang]['no_churn'];
//         var brand_1 = joinWithColor(results['nochurn_b'], 'green');
//         var txt_1 = '<p>' + tmp[getRandomInt(tmp.length)].replace('{}', brand_1) + '</p>';
//         txt = txt + txt_1;
//         return txt;
//     }
//
//     // At least one churn detected
//     if(results['churn_b'].length !== 0) {
//         var tmp = answers[lang]['churn'];
//         var brand_2 = joinWithColor(results['churn_b'], 'red');
//         var txt_2 = tmp[getRandomInt(tmp.length)].replace('{}', brand_2);
//         var txt_3 = '';
//         if( results['nochurn_b'].length !== 0) {
//             var tmp = answers[lang]['churn_no_churn'];
//             var brand_3 = joinWithColor(results['nochurn_b'], 'green');
//             txt_3 = tmp[getRandomInt(tmp.length)].replace('{}', brand_3);
//         }
//         txt = txt + '<p>' + txt_2 + ' ' + txt_3 + '</p>';
//         return txt;
//     }
//
//     return txt
//
// }

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
//
// function getAdditionalInfo(data) {
//     var txt = '<br />';
//     // Go over brands target / competitor
//     if(data['churn_b'].length !== 0) {
//         txt += '<p>' + joinWithColor(['Churn'], 'red') + ': '
//             + '<span class="text-highlight">' + data['churn_b'].join(', ') + ' </span></p>';
//     }
//     if(data['nochurn_b'].length !== 0) {
//         txt += '<p>' + joinWithColor(['No Churn'], 'green') + ': '
//             + '<span class="text-highlight">' + data['nochurn_b'].join(', ') + ' </span></p>';
//     }
//
//     return txt;
// }

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

// function getRandomInt(max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }

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

            // var emotion = getEmotion(data);
            // var formattedAnswer = formatAnswer(data);
            // formattedAnswer += getAdditionalInfo(data);

            // ChatbotLayout.pushMessage(, 'bot', emotion);
        }
    });
}
