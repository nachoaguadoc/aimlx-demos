var BasicIoLayout = {
    samples: [],
    sampleLink: '',
    numberOfSamples: 8,
    samplesDisplay: [],
    isLoading: false,
    submitFunction: function (data) {

    },
    config: function (options) {
        this.initializeUiElements();
        if (options.sampleLink) {
            $('.sample-container').removeClass('aix-invisible');
            this.sampleLink = options.sampleLink;
            this.loadSamples();
        }
        if (options.submitFunction) {
            this.submitFunction = options.submitFunction;
        } else {
            throw "SubmitFunction is not defined in config method.";
        }
    },
    loadSamples: function () {
        var self = this;
        self.showSampleLoader();
        $.getJSON(this.sampleLink, function (json) {
            self.samples = json.samples;
            self.getRandomSamples();
            self.hideSampleLoader();
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
                    var data = self.samplesDisplay[$(e.target).data('index')];
                    self.submitFunction(data);
                    self.setLoadingState();
                }
            });
        }
    },
    setLoadingState: function () {
        this.isLoading = true;
        $('#btn-submit').addClass('disabled');
        $('.aix-loader').removeClass('aix-invisible');
        $('#tab-results-link').addClass('disabled');
    },
    showResults: function () {
        if (this.isLoading) {
            this.isLoading = false;
            $('#btn-submit').removeClass('disabled');
            $('.aix-loader').addClass('aix-invisible');
            var content = $('#tab-results-link').attr('href');
            $('#tab-results-link').removeClass('disabled').addClass('active')
                .parent().siblings().children().removeClass('active');
            $(content).show();
            $(content).siblings('.aix-tab-content').hide();
        }
    },
    initializeUiElements: function () {
        this.initializeTabs();
        var self = this;

        function submit() {
            var input = $('#input-submit').val();
            if (input && !self.isLoading) {
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
    },
    initializeTabs: function () {
        $('.aix-tab-content').slice(1).removeClass('aix-invisible').hide();
        $('.aix-tab-menu li a').eq(0).addClass('active');
        $('.aix-tab-menu li a').click(function (e) {
            e.preventDefault();
            var content = $(this).attr('href');
            $(this).addClass('active');
            $(this).parent().siblings().children().removeClass('active');
            $(content).show();
            $(content).siblings('.aix-tab-content').hide();
        });
    },
    showSampleLoader: function () {
        $('.sample-data-loader').show();
    },
    hideSampleLoader: function () {
        $('.sample-data-loader').hide();
    }
};


