var BasicIoLayout = {
    samples: [],
    sampleLink: '',
    numberOfSamples: 8,
    samplesDisplay: [],
    isLoading: false,
    dataInput: '',
    minInputLength: 2,
    submitFunction: function (data) {
    },
    config: function (options) {
        if (options.submitFunction) {
            this.submitFunction = options.submitFunction;
        } else {
            throw "SubmitFunction is not defined in config method.";
        }
        this.initializeUiElements();
        if (options.sampleLink) {
            $('.sample-container').removeClass('aix-invisible');
            this.sampleLink = options.sampleLink;
            this.loadSamples();
        }
    },
    loadSamples: function () {
        var self = this;
        self.showSampleLoader();
        $.getJSON(this.sampleLink, function (json) {
            self.samples = json.samples;
            self.getRandomSamples();
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
            var maxLenght = 90;
            var self = this;
            var sampleText = this.samplesDisplay[i];
            if (sampleText.length > maxLenght) {
                sampleText = sampleText.substring(0, (maxLenght-3)) + '...'
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
        $('#btn-submit').addClass('disabled aix-button--processing');
        $('#btn-submit span').hide();
        $('.ellipsis-loader').show();
        $('#input-submit').prop('disabled', true);
    },
    showResults: function (data) {
        if (this.isLoading) {
            this.isLoading = false;
            $('#aix-result-data').append(data);
            $('#btn-submit').removeClass('aix-button--processing');
            $('#tab-results').show();
            $('#tab-input').hide();
            $('#input-submit').prop('disabled', false).val('');
            $('#btn-submit span').show();
            $('.ellipsis-loader').hide();
            $('.sample-box--selected').removeClass('sample-box--selected');
        }
    },
    submit: function () {
        if (this.dataInput.length > this.minInputLength && !this.isLoading) {
            this.submitFunction(this.dataInput);
            this.setLoadingState();
        }
    },
    initializeUiElements: function () {
        var self = this;

        $('#btn-submit').on('click', function () {
            self.submit()
        });
        $('#btn-try-another').on('click', function () {
            $('#tab-input').show();
            $('#tab-results').hide();
            $('#aix-result-data').empty();
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
        );
        $('#tab-results').removeClass('aix-invisible').hide();
        $('.ellipsis-loader').removeClass('aix-invisible').hide()
    },
    showSampleLoader: function () {
        $('.sample-data-loader').show();
    },
    hideSampleLoader: function () {
        $('.sample-data-loader').hide();
    }
};
