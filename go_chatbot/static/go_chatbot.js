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
            if(chat_ended == true){
                endChat(1200);
            }
            ChatbotLayout.pushMessage('<span class="speech-buble-text">' + system_action_nl + '</span><br><a href="" id="display-json">This is what I understood</a><div id="json-object" class="display-none">' + jsonObject + '</div>', 'bot');
            toggleJsonObject();
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

$('.sample-container__header h4').text("Needed Information");
$('.btn-sample-refresh').removeClass("aix-invisible");

var someJson = {movie: "Matrix", nbTickets: 2};
var str = JSON.stringify(someJson, null, 2);
var jsonObject = ('<pre><code class="json">' + str + "</code></pre>");

function toggleJsonObject (){
    $('#display-json').click(function( event ){
        event.preventDefault();
        $("#json-object").toggle();
        //if($('#display-json').val == 'This is what I understood')
        var value = $('#display-json').text();
        if(value == 'This is what I understood'){
            $('#display-json').text('Hide');
        }else{
            $('#display-json').text('This is what I understood');
        }
    });
}
