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
};