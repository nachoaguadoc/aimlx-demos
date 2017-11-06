var ChatbotLayout = {
    samples: [],
    sampleLink: '',
    numberOfSamples: 8,
    samplesDisplay: [],
    chatbotVocabulary: {
        startingConversation: '',
        answeringQuestion: []
    },
    submitFunction: function (data) {
        console.log(data)
    },
    config: function (options) {
        this.sampleLink = options.sampleLink;
        this.chatbotVocabulary = options.chatbotVocabulary;
        this.numberOfSamples = options.numberOfSamples;
        this.loadSamples();
        this.initializeUiEventHandler();
    },
    loadSamples: function () {
        var self = this;
        $.getJSON(this.sampleLink, function (json) {
            self.samples = json.candidates;
            self.samplesDisplay = self.getRandomSamples();
            self.pushMessage(self.chatbotVocabulary.startingConversation, 'bot')
        });
    },
    getRandomSamples: function () {
        this.samplesDisplay = [];
        if (this.samples.length > this.numberOfSamples) {
            var randomIndexes = [];
            while (randomIndexes.length < this.numberOfSamples) {
                var randomNumber = Math.ceil(Math.random() * this.numberOfSamples);
                if (randomIndexes.indexOf(randomNumber) > -1) continue;
                randomIndexes[randomIndexes.length] = randomNumber;
            }
            for (var i in randomIndexes) {
                this.samplesDisplay.push(this.samples[randomIndexes[i]]);
            }
        } else {
            this.samplesDisplay = this.samples;
        }
        this.showSamples();
    },
    showSamples: function () {
        $('#sample-data').empty();
        for (var i in this.samplesDisplay) {
            var self = this;
            $('#sample-data').append('<div class="col-md-6"><div id="sample-' + [i] + '" class="sample-box">' + this.samplesDisplay[i] + '</div></div>');
            $('#sample-' + [i]).on('click', function (e) {
                var data = $(e.target).text();
                self.pushMessage(data, 'client');
                self.submitFunction(data);
            });
        }
    },
    pushMessage: function (messageData, type) {
        switch (type) {
            case 'client':
                this.addClientSpeechBuble(messageData);
                break;
            case 'bot':
                this.addBotSpeechBuble(messageData);
                break;
            default:
                this.addBotSpeechBuble(messageData);
                break;
        }
        $("#chat-data").animate({scrollTop: $("#chat-data")[0].scrollHeight}, 500);
    },
    addBotSpeechBuble: function (messageData) {
        $('#chat-data').append('<div class="bot-buble-container"><div class="bot-buble-container__inner"><img src="../static/ui-kit/custom/assets/bot.svg"/><div class="speech-buble"><p>' + messageData + '</p></div></div></div>');
    },
    addClientSpeechBuble: function (messageData) {
        $('#chat-data').append('<div class="speech-buble speech-buble--user"><p>' + messageData + '</p></div>');
    },
    initializeUiEventHandler: function () {
        var self = this;

        function submit() {
            var input = $('#input-submit').val();
            if (input) {
                self.pushMessage(input, 'client');
                self.submitFunction(input);
                $('#input-submit').val('')
            }
        }

        $('#btn-refresh').on('click', function () {
            self.getRandomSamples()
        });
        $('#btn-submit').on('click', function () {
            submit()
        });
        $('#input-submit').keypress(function (e) {
            if (e.which == 13) {
                submit();
                return false;
            }
        })
    }
};