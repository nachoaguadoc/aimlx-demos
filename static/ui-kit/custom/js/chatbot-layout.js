var ChatbotLayout = {
    samples: [],
    sampleLink: '',
    numberOfSamples: 8,
    samplesDisplay: [],
    isLoading: false,
    dataInput: '',
    textStartingConversation: 'Ask me question.',
    minInputLength: 2,
    submitFunction: function (data) {
    },
    config: function (options) {
        if (options.submitFunction) {
            this.submitFunction = options.submitFunction;
        } else {
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
    },
    loadSamples: function () {
        var self = this;
        self.showSampleLoader();
        $.getJSON(this.sampleLink, function (json) {
            self.samples = json.samples;
            self.getRandomSamples();
            self.pushMessage('<p>' + self.textStartingConversation + '</p>', 'bot');
            self.hideSampleLoader();
            if (self.samples.length > self.numberOfSamples) {
                $('#btn-refresh').removeClass('aix-invisible').on('click', function () {
                    self.getRandomSamples()
                });
            }
        });
    },
    getRandomSamples: function () {
        this.samplesDisplay = [];
        if (this.samples.length > this.numberOfSamples) {
            var randomIndexes = [];
            while (randomIndexes.length < this.numberOfSamples) {
                var randomNumber = Math.ceil(Math.random() * (this.samples.length - 1));
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
                    $('.sample-box--selected').removeClass('sample-box--selected');
                    $(this).addClass('sample-box--selected');
                    var data = self.samplesDisplay[$(e.target).data('index')];
                    $('#input-submit').val(data);
                    $('#btn-submit').removeClass('disabled');
                    self.dataInput = data;
                }
            });
        }
    },
    setLoadingState: function () {
        this.isLoading = true;
        $('#btn-submit').addClass('disabled');
        this.addBotSpeechBuble('<div class="ellipsis-loader"><div></div><div></div><div></div></div>')
        $('#input-submit').prop('disabled', true);
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
        $('.sample-box--selected').removeClass('sample-box--selected');
        $('#chat-data .speech-buble').last().empty().append(messageData);
        $('#input-submit').prop('disabled', false);
    },
    addBotSpeechBuble: function (messageData) {
        $('#chat-data').append('<div class="bot-buble-container"><img src="../static/ui-kit/custom/assets/bot.svg"/><div class="speech-buble">' + messageData + '</div></div>');
    },
    addClientSpeechBuble: function (messageData) {
        $('#chat-data').append('<div class="speech-buble speech-buble--user"><p>' + messageData + '</p></div>');
    },
    submit: function () {
        if (this.dataInput.length > this.minInputLength && !this.isLoading) {
            this.pushMessage(this.dataInput, 'client');
            this.submitFunction(this.dataInput);
            this.setLoadingState();
            $('#input-submit').val('')
        }
    },
    initializeUiEventHandler: function () {
        var self = this;

        $('#btn-submit').on('click', function () {
            self.submit()
        });
        $('#input-submit').keypress(function (e) {
            if (e.which === 13) {
                self.submit();
                return false;
            }
        }).on('input', function () {
                self.dataInput = this.value;
                if (self.dataInput.length > self.minInputLength) {
                    $('#btn-submit').removeClass('disabled');
                } else {
                    $('#btn-submit').addClass('disabled')
                }
            }
        )
    },
    showSampleLoader: function () {
        $('.sample-data-loader').show();
    },
    hideSampleLoader: function () {
        $('.sample-data-loader').hide();
    }
};