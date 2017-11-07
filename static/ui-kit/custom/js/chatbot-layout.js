var ChatbotLayout = {
    samples: [],
    sampleLink: '',
    numberOfSamples: 8,
    samplesDisplay: [],
    textStartingConversation: '',
    isLoading: false,
    submitFunction: function (data) {
        console.log(data)
    },
    config: function (options) {
        this.sampleLink = options.sampleLink;
        this.textStartingConversation = options.textStartingConversation;
        this.submitFunction = options.submitFunction;
        this.loadSamples();
        this.initializeUiEventHandler();
    },
    loadSamples: function () {
        var self = this;
        $.getJSON(this.sampleLink, function (json) {
            self.samples = json.candidates;
            self.getRandomSamples();
            self.pushMessage(self.textStartingConversation, 'bot')
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
            var maxLenght = 100;
            var self = this;
            var sampleText = this.samplesDisplay[i];
            if (sampleText.length > maxLenght) {
                sampleText = sampleText.substring(0, maxLenght) + ' ...'
            }
            $('#sample-data').append('<div class="col-md-6"><div id="sample-' + [i] + '" data-index="' + [i] + '" class="sample-box">' + sampleText + '</div></div>');

            $('#sample-' + [i]).on('click', function (e) {
                if (!self.isLoading) {
                    var data = self.samplesDisplay[$(e.target).data('index')];
                    self.pushMessage(data, 'client');
                    self.submitFunction(data);
                    self.setLoadingState();
                }
            });
        }
    },
    setLoadingState: function () {
        this.isLoading = true;
        $('#btn-submit').addClass('disabled');
        this.addBotSpeechBuble('<div class="ellipsis-loader"><div></div><div></div><div></div></div>')
    },
    pushMessage: function (messageData, type) {
        switch (type) {
            case 'client':
                this.addClientSpeechBuble(messageData);
                break;
            case 'bot':
                if (this.isLoading) {
                    this.updateBotSpeechBuble(messageData);
                } else {
                    this.addBotSpeechBuble(messageData);
                }
                break;
            default:
                this.addBotSpeechBuble(messageData);
                break;
        }
        $("#chat-data").animate({scrollTop: $("#chat-data")[0].scrollHeight}, 500);
    },
    updateBotSpeechBuble: function (messageData) {
        this.isLoading = false;
        $('#chat-data .speech-buble').last().empty().append(messageData);
        $('#btn-submit').removeClass('disabled');
    },
    addBotSpeechBuble: function (messageData) {
        $('#chat-data').append('<div class="bot-buble-container"><div class="bot-buble-container__inner"><img src="../static/ui-kit/custom/assets/bot.svg"/><div class="speech-buble">' + messageData + '</div></div></div>');
    },
    addClientSpeechBuble: function (messageData) {
        $('#chat-data').append('<div class="speech-buble speech-buble--user"><p>' + messageData + '</p></div>');
    },
    initializeUiEventHandler: function () {
        var self = this;

        function submit() {
            var input = $('#input-submit').val();
            if (input && !self.isLoading) {
                self.pushMessage(input, 'client');
                self.submitFunction(input);
                self.setLoadingState();
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
            if (e.which === 13) {
                submit();
                return false;
            }
        })
    }
};