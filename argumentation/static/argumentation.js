BasicIoLayout.config({
    sampleLink: "argumentation/static/samples.json",
    submitFunction: submit
});

function submit(input) {
    var url = "/argumentation";
    var data = {"input": input};
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function (data) {
            labels = data['labels'];
            text = data['text'];
            var formattedAnswer = formatAnswer(text, labels);
            BasicIoLayout.showResults(formattedAnswer);
        }
    });
}

function formatAnswer(original, labels) {
    var formattedText = '';
    var labelsSplitted = labels.split(" ");
    var originalSplitted = original.split(" ");
    for (i = 0; i < labelsSplitted.length; i++) {
        if (labelsSplitted[i] === "O") {
            formattedText += '<span>' + originalSplitted[i] + ' </span>';
        } else {
            formattedText += '<span class="font--semi-bold int-blue">' + originalSplitted[i] + ' </span>';
        }
    }
    return ('<p>' + formattedText + '</p>')

}
