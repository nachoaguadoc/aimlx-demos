    var SummarizationLayout = {
        samples: [],
        sampleLink: '',
        numberOfSamples: 8,
        samplesDisplay: [],
        isLoading: false,
        mode: 1,
        dataInput: '',
        minInputLength: 9,
        submitFunction: function (data) {

        },

        config: function (options) {
            if (options.submitFunction) {
                this.submitFunction = options.submitFunction;
            } else {
                throw "SubmitFunction is not defined in config method.";
            }
            this.initializeUiElements();
        },

        setLoadingState: function () {
            this.isLoading = true;
            this.changeStateButton();
            $('#url-submit').prop('disabled', true);
            $('#tab-results').hide();
            $('#aix-result-document').empty();
            $('#aix-result-summary').empty();
            $('#loader').css("display", "flex");
        },

        showResults: function (doc, summary) {
            if (this.isLoading) {
                this.isLoading = false;
                this.changeStateButton();
                $('#url-submit').prop('disabled', false).val('');
                $('#loader').css("display", "none");
                $('#aix-show-source').append('<p>Extracted text from &nbsp;</p><a href="' + this.dataInput + '" target="_blank">' + this.dataInput + '</a>');
                $('#aix-result-document').append(doc);
                $('#aix-result-summary').append(summary);
                $('#tab-results').show();
                this.dataInput = "";
                this.changeStateButton();
            }
        },

        changeStateButton: function () {
            if(this.isLoading) {
                $('#btn-submit span').hide();
                $('#btn-submit').addClass('aix-button--processing');
            }else{
                $('#btn-submit').removeClass('aix-button--processing');
                $('#btn-submit').addClass('disabled');
                $('#btn-submit span').show();
            }
        },

        submit: function () {
            if (this.dataInput.length > this.minInputLength && !this.isLoading && this.mode != 0) {
                this.submitFunction(this.dataInput, this.mode);
                this.setLoadingState();
            }
        },

        mode_select: function(mode_type) {
            this.mode=mode_type;
            this.check_completion();
        },

        check_completion: function(){
            if (this.dataInput.length > this.minInputLength) {
                 $('#btn-submit').removeClass('disabled');
            } else {
                 $('#btn-submit').addClass('disabled');
             }
        },

        initializeUiElements: function() {
            var self = this;
            $('#tab-results').hide();
            $('#aix-result-document').empty();
            $('#aix-result-summary').empty();


            $('#btn-submit').on('click', function () {
                self.submit();
            });

            $('#radio-ext').on('click', function () {
                self.mode_select(1);
                $("#model-description").text( "Key paragraphs from the original text are extracted to create the summary." );
            });

            $('#radio-gen').on('click', function () {
                self.mode_select(2);
                $("#model-description").text( "This model produces new sentences from the original text, using words from its vocabulary and rephrasing key elements." );
            });

            $('#radio-gen-old').on('click', function () {
                self.mode_select(3);
                $("#model-description").text( "This model is similar to the new generative one. But it tends to directly use a lot of sentences from the original text without reconstructing it." );
            });

            $('#url-submit').keypress(function (e) {
                if (e.which === 13) {
                    self.submit();
                    return false;
                }
            }).on('input', function () {
                    self.dataInput = this.value;
                    self.check_completion();
                }
            );
         }
    };

    SummarizationLayout.config({
        submitFunction: submit
    });

    function submit(input, mode) {

        var url = "";
        if(mode == 1) {
            url = "/summarization/ext";
        }else if(mode >= 2){
            url = "/summarization/gen";
        }

        var data = {"input": input, "mode": mode};
        $.ajax({
            type: "POST",
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(data, null, '\t'),
            success: function (data) {
                doc = data['document'];
                summary = data['summary'];
                var formattedDocument = formatDocument(doc);
                var formattedSummary = formatSummary(summary);
                SummarizationLayout.showResults(formattedDocument, formattedSummary);
            }
        });
    }

    function formatDocument(doc) {
        var formattedText = (/*'<p>' + '<span>'+ */doc/* + '</span>' + '</p>'*/)
        return formattedText
    }

    function formatSummary(summary) {
        var formattedText = (/*'<p>' + '<span>'+ */summary/* + '</span>' + '</p>'*/)
        return formattedText
    }
