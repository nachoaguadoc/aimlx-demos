var ChatbotLayout = {
    samples: [],
    sampleLink: '',
    numberOfSamples: 8,
    samplesDisplay: [],
    chatbotVocabulary: {
        startingConversation: '',
        answeringQuestion: []
    },
    apiUrl: '',
    config: function (options) {
        this.sampleLink = options.sampleLink;
        this.chatbotVocabulary = options.chatbotVocabulary;
        this.numberOfSamples = options.numberOfSamples;
        this.loadSamples();
    },
    loadSamples: function () {
        var self = this;
        $.getJSON(this.sampleLink, function (json) {
            self.samples = json.candidates;
            self.samplesDisplay = self.getRandomSamples(self.samples, self.numberOfSamples);
            self.pushMessage(self.chatbotVocabulary.startingConversation, 'bot')
        });
    },
    getRandomSamples: function (samples, numberOfSamples) {
        this.samplesDisplay = [];
        if (samples.length > numberOfSamples) {
            var randomIndexes = [];
            while (randomIndexes.length < numberOfSamples) {
                var randomNumber = Math.ceil(Math.random() * numberOfSamples);
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
        for (var i in this.samplesDisplay) {
            $('#sample-data').append('<div class="col-md-6"><div id="sample-' + [i] + '" class="sample-box">' + this.samplesDisplay[i] + '</div></div>');
            $('#sample-data').on('click', '#sample-' + [i], function (e) {
                console.log($(e.target).text())
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
    },
    addBotSpeechBuble: function (messageData) {
        $('#chat-data').append('<div class="bot-buble-container"><div class="bot-buble-container__inner"><img src="../static/ui-kit/custom/assets/bot.svg"/><div class="speech-buble"><p>' + messageData + '</p></div></div></div>');
    },
    addClientSpeechBuble: function (messageData) {
        $('#chat-data').append('<div class="speech-buble speech-buble--user"><p>' + messageData + '</p></div>');
    }
};