ChatbotLayout.loadSamples = function () {
    var self = this;
    self.showSampleLoader();
    $.getJSON(this.sampleLink, function (json) {
        self.moviename = json.moviename;
        self.nbrPeople = json.nbrPeople;
        self.date = json.date;
        self.time = json.time;
        self.city = json.city;
        self.theatre = json.theatre;
        self.getRandomSamples();
        self.pushMessage('<p>' + self.textStartingConversation + '</p>', 'bot');
        self.hideSampleLoader();
        $('#btn-refresh').removeClass('aix-invisible').on('click', function () {
            self.getRandomSamples();
        });
    });
}

ChatbotLayout.getRandomSamples = function () {
    $('#sample-data').empty();
    this.samplesDisplay = [];

    //  A random number to display example data randomly
    var randomNumber = parseInt(Math.round(Math.random() * (this.numberOfSamples)));
    //  Push data into an array "this.samplesDisplay"
    var neededInformation = [this.moviename, this.nbrPeople, this.date, this.time, this.city, this.theatre];
    for(i = 0; i < neededInformation.length; i++){
        this.samplesDisplay.push(neededInformation[i][randomNumber]);
    }

    // function call showSamples
    this.showSamples();
}

ChatbotLayout.showSamples = function () {
    var sampleText = '';
    for(i = 0; i < this.samplesDisplay.length; i++){
        sampleText = '<p class="sample-data"><i>' + this.samplesDisplay[i] + '</i></p>';
        $('#sample-data').append(sampleText);
    }
}

function submit(input) {
    var data = {"input": removePunctuation(input).toLowerCase()};
    var url = "/go_chatbot";
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function (data) {
            var system_action_nl = data["system_action_nl"];
            var chat_ended = data["chat_ended"];
            var userDialogueAct = data["user_dia_act"];
            var information = data["user_dia_act"]["information"];
            var jsonObject = JSON.stringify(userDialogueAct, null, 2);

            var randomNumber = Math.floor(Math.random() * Math.floor(500));
            const id = 'code_highlighting_' + randomNumber;
            var formattedJsonObject = '<pre id="'+ id +'"><code class="json">' + jsonObject + '</code></pre>';

            if(chat_ended == true){
                endChat(1200);
            }

            ChatbotLayout.pushMessage('<span class="speech-buble-text">' + system_action_nl + '</span><br><a href="" id="display-json-' + id + '">This is what I understood</a><div class="json-object">' + formattedJsonObject + '</div>', 'bot');
            highlightingBlock(id);
            toggleJsonObject(id);
            checkingChatbotUnderstanding(information);
        }
    });
}

ChatbotLayout.config({
    sampleLink: "go_chatbot/static/samples-info.json",
    textStartingConversation: 'Hello, how can I help you to book a movie ticket?',
    submitFunction: submit,
    config: function (options) {
        if (options.submitFunction) {
            this.submitFunction = options.submitFunction;
        }else {
            throw "SubmitFunction is not defined in config method.";
        }
        this.initializeUiEventHandler();
        if (options.sampleLink) {
            $('.sample-container').removeClass('aix-invisible');
            this.sampleLink = options.sampleLink;
            this.loadSamples();
        }
        if (options.textStartingConversation) {
            this.textStartingConversation = options.textStartingConversation;
        }
    }
});

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

function toggleJsonObject (id){
    $('#display-json-' + id).next().hide();

    $('#display-json-' + id).click(function( event ){
        event.preventDefault();
        $(this).next().toggle();
        var value = $(this).text();
        if(value == 'This is what I understood'){
            $(this).text('Hide');
        }else{
            $(this).text('This is what I understood');
        }
    });
}

function highlightingBlock(id){
    var code = document.getElementById(id);
    hljs.highlightBlock(code);
}

$('.sample-container__header h4').text("Needed Information");
$('.btn-sample-refresh').removeClass("aix-invisible");


function checkingChatbotUnderstanding (information) {

    //Array with every keys of the answer JSON object
    var existingKeys = Object.keys(information);
    for(i = 0; i < existingKeys.length; i++){

        //Checks whether the element has already been checked
        var iconSelector = "icon-" + existingKeys[i];
        var iconElement = document.getElementById(iconSelector);

        if(iconElement === null){
            $('#' + existingKeys[i]).after('<i id="icon-' + existingKeys[i] + '"class="icon icon-011-check-mark icon--s2 checked" aria-hidden="true"></i>');
        }else{
            //Do nothing
        }
    }
}
//<i class="icon icon-011-check-mark icon--s3" aria-hidden="true"></i>
/*if(existingKeys[i] === checkInformation[i]){

    }else{
    //
    }*/

/*
    var checkInformation = ["city", "date", "moviename", "numberofpeople","starttime", "theater"];
    var existingKeys = Object.keys(information);
    for(i = 0; i < checkInformation.length; i++){
        console.log(Object.keys(information));
        //console.log(checkInformation[i]);
    }
*/
