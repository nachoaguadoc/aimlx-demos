// Loads sample data to show the user examples for asking a question to the chatbot
ChatbotLayout.loadSamples = function () {
    self = this;
    self.showSampleLoader();
    $.getJSON(this.sampleLink, function (json) {
        const samples = {};
        samples.moviename = json.moviename;
        samples.numberofpeople = json.numberofpeople;
        samples.date = json.date;
        samples.starttime = json.starttime;
        samples.city = json.city;
        samples.theater = json.theater;
        self.getRandomSamples(samples);
        self.pushMessage('<p>' + self.textStartingConversation + '</p>', 'bot');
        self.hideSampleLoader();

        $('#btn-refresh').on('click', function () {
            self.getRandomSamples(samples);
        });
    });
}

//Choose sample data randomly
ChatbotLayout.getRandomSamples = function (samples) {
    $('#sample-data').empty();
    this.samplesDisplay = [];
    count();
    // A random number to display example data randomly
    //var randomNumber = parseInt(Math.round(Math.random() * (this.numberOfSamples)));

    //  Push data into an array "this.samplesDisplay"
    var neededInformation = [samples.moviename, samples.numberofpeople, samples.date, samples.starttime, samples.city, samples.theater];

    //Create the array -> insert the selected samples (with randomNumber);
    for(i = 0; i < neededInformation.length; i++){
        this.samplesDisplay.push(neededInformation[i][num]);
    }

    // function call showSamples
    this.showSamples(samples);
}

//Displays samples on the right side of the demo
ChatbotLayout.showSamples = function (samples) {
    var dataKeys = Object.keys(samples);
    for(i = 0; i < this.samplesDisplay.length; i++){
        var samplesData = '<p id="data-key-' + dataKeys[i] + '"class="sample-data"><i>' + this.samplesDisplay[i] + '</i></p>';
        $('#sample-data').append(samplesData);
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
            var purpose = userDialogueAct["purpose"];
            var information = userDialogueAct["information"];
            var jsonObject = JSON.stringify(userDialogueAct, null, 2);

            // Assigning an ID to each JSON object in the speech-bubbles
            var randomNumber = Math.floor(Math.random() * Math.floor(500));
            const id = 'code_highlighting_' + randomNumber;
            var formattedJsonObject = '<pre id="'+ id +'"><code class="json">' + jsonObject + '</code></pre>';

            /*if(chat_ended == true){
            endChat(1200);
            }*/

            ChatbotLayout.pushMessage('<span class="speech-buble-text">' + system_action_nl + '</span><br><a href="" id="display-json-' + id + '">This is what I understood</a><div class="json-object">' + formattedJsonObject + '</div>', 'bot');
            // Highlight the JSON Object with colors on the chatbot speech-bubble
            highlightingBlock(id);
            // Display/hide the JSON Object in the chatbot speech-bubble
            toggleJsonObject(id);
            // Display the informations that the chatbot understood
            checkingChatbotUnderstanding(information);
            purposeEndChat(purpose, id);
            // Give the user some hint for starting the conversation with the chatbot
            userInstruction();
            userQuestionSample();
            $('#input-submit').focus();
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

// Toggle (show/hide) the JSON Object in the speech-bubble
function toggleJsonObject (id){
    $('#display-json-' + id).next().hide();
    $('#display-json-' + id).click(function( event ){
        event.preventDefault();
        var value = $(this).text();
        if(value == 'This is what I understood'){
            $(this).next().toggle();
            $(this).text('Hide');
        }else if(value == 'Book another ticket'){
            window.location.reload();
        }else{
            $(this).next().toggle();
            $(this).text('This is what I understood');
        }
    });
}

// Highlight JSON objects (highlight.js)
function highlightingBlock(id){
    var code = document.getElementById(id);
    hljs.highlightBlock(code);
}

// Check if the chatbot understood the question and put a checkmark next to the needed Information on the right side
function checkingChatbotUnderstanding (information) {

    //Array with every keys of the JSON object in the speech-bubble
    var existingKeys = Object.keys(information);
    for(i = 0; i < existingKeys.length; i++){

        //Checks whether the element has already been checked
        var iconSelector = "icon-" + existingKeys[i];
        var checkMarkIcon = document.getElementById(iconSelector);

        if(checkMarkIcon === null){
            $('#' + existingKeys[i]).after('<i id="icon-' + existingKeys[i] + '"class="icon icon-011-check-mark icon--s2 checked" aria-hidden="true"></i>');
        }
    }
    for(i=0; i < existingKeys.length; i++){
        $("#data-key-" + existingKeys[i]).html('<p class="user-data">' + information[existingKeys[i]] + '</p>');
    }
}

function purposeEndChat (purpose, id) {
    if(purpose == "closing"  || purpose  == "thanks"){
        $('#display-json-' + id).text('Book another ticket');
        $('#input-submit').prop('disabled', true);
    }
}

$('.sample-container__header h4').text("Needed Information");
$('.btn-sample-refresh').removeClass("aix-invisible");

var num = parseInt(Math.round(Math.random() * (8)));

function count() {
    if(num >= 8){
        num = 0;
    }else{
        num++;
    }
    return num;
}


// Help for the user | The three functions below are used to guide the user to start a conversation with the chatbot
// Block Part "How to get started

//Instruction & Question Data Object
var stepsInstruction = {
    getStarted : 'Find here a sample question to start chatting',
    neededInformation: 'Ask chatbot the needed information',
    bookTickets : 'The chatbot can now help you to book tickets',
    confirmation : 'Confirm your reservation'
}

var stepsQuestion = {
    getStarted : 'Which theater is available tomorrow for 3 tickets for Deadpool ?',
    neededInformation: 'Which start time is available ?',
    bookTickets : 'Can you please help me book tickets ?',
    confirmation : 'Okay'
}

//Add the question in the chatbot input field when the user click on the question sample link (right side)
$('#hint-question').click(function(){
    var questionSample;
    if($('#hint-instruction').text() === stepsInstruction.getStarted){
        questionSample = stepsQuestion.getStarted;
    }else if($('#hint-instruction').text() === stepsInstruction.neededInformation){
        questionSample = stepsQuestion.neededInformation;
    }else if($('#hint-instruction').text() === stepsInstruction.bookTickets){
        questionSample = stepsQuestion.bookTickets;
    }else if($('#hint-instruction').text() === stepsInstruction.confirmation){
        questionSample = stepsQuestion.confirmation;
    }

    $('#input-submit').val(questionSample);
    $('#input-submit').focus();
    $('#btn-submit').removeClass('disabled');
});


//Display the instructions/hint that help the user to start
function userInstruction(){
    var hintInstruction;
    if($('#hint-instruction').text() === stepsInstruction.getStarted){
        hintInstruction = stepsInstruction.neededInformation;
    }else if($('#hint-instruction').text() === stepsInstruction.neededInformation){
        hintInstruction = stepsInstruction.bookTickets;
    }else if($('#hint-instruction').text() === stepsInstruction.bookTickets){
        hintInstruction = stepsInstruction.confirmation;
    }

    $('#hint-instruction').text(hintInstruction);
}

//Display the question sample for starting the conversation
function userQuestionSample(){
    var hintQuestion;
    if($('#hint-question p i').text() === stepsQuestion.getStarted){
        hintQuestion = stepsQuestion.neededInformation;
    }else if($('#hint-question p i').text() === stepsQuestion.neededInformation){
        hintQuestion = stepsQuestion.bookTickets;
    }else if($('#hint-question p i').text() === stepsQuestion.bookTickets){
        hintQuestion = stepsQuestion.confirmation;
    }

    $('#hint-question p i').text(hintQuestion);
}
