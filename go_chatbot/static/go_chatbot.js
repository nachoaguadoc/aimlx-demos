ChatbotLayout.config(
    {
        sampleLink: "go_chatbot/static/samples.json",
        textStartingConversation: 'Hello, how can I help you to book a movie ticket?',
        submitFunction: submit
    }
);

function submit(input) {
    var data = {"input": removePunctuation(input).toLowerCase()};
    var url = "/go_chatbot";
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function (data) {
            var system_action_nl = data["system_action_nl"]
            var chat_ended = data["chat_ended"];

            if(chat_ended == true){
                endChat(1200);
            }

            ChatbotLayout.pushMessage('<span class="speech-buble-text">' + system_action_nl + '</span>', 'bot');
        }
    });
}

function removePunctuation(input) {
    return input.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
}

function endChat(time){
    setTimeout(
        function(){
            if(confirm('The dialogue finished')){
                window.location.reload();
            }
        }, time);
}