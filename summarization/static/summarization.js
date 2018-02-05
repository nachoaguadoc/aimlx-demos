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
        $('.result').addClass("aix-invisible");
        $('#loader').removeClass("aix-invisible");
        $('#aix-show-source').empty();
        $('#aix-result-document').empty();
        $('#aix-result-summary').empty();
        $('#error').empty();
    },

    showResults: function (docs, summary) {
        if (this.isLoading) {
            this.isLoading = false;
            this.changeStateButton();
            $('#url-submit').prop('disabled', false).val('');
            $('#url-submit').removeClass('is-fixed');
            $('#loader').addClass("aix-invisible");
            $('.result').removeClass("aix-invisible");
            $('.aix-show-source').append('<p>Extracted text from &nbsp;</p><a href="' + this.dataInput + '" target="_blank">' + this.dataInput + '</a>');
            $('#aix-result-summary').append(summary);
            $('#aix-result-document').append(docs);
            this.dataInput = "";
            this.changeStateButton();
        }
    },

    showError: function (err) {
        if (this.isLoading) {
            this.isLoading = false;
            this.changeStateButton();
            $('#url-submit').prop('disabled', false).val('');
            $('#loader').addClass("aix-invisible");
            $('#error').append('<p>An error occurred. Please try again later.</p>');
            $('#tab-results').removeClass("aix-invisible");
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
        $('#tab-results').addClass("aix-invisible");
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
     },
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
            docs = data['document'];
            summaries = data['summary'];

            if(mode == 1){

                /*  RESULT FOR THE EXTRACTIVE MODEL   */

                let docsWithSummaryInfo = addSummaryInfo(docs, summaries);
                formattedDocument = formatDocument(docsWithSummaryInfo);
                formattedSummary = formatSummary(summaries, docs);
                SummarizationLayout.showResults(formattedDocument, formattedSummary);

            }else{

            /*  RESULT FOR THE GENERATIVE MODELS   */

                formattedDocumentGen = formatDocumentGen(docs);
                formattedSummaryGen = formatSummaryGen(summaries);
                SummarizationLayout.showResults(formattedDocumentGen, formattedSummaryGen);
            }
        },
        error: function (err) {
            SummarizationLayout.showError();
        }
    });
}
    /* -----------------------------        EXTRACTIVE MODEL        -----------------------------   */

    /*  Adding some info to paragraphs  */

    function addSummaryInfo (docs, summaries){
        let docsWithSummaryInfo = docs.map(function(doc) {
            return {
                text: doc
            }
        });
        summaries.forEach(function(summary){
                docsWithSummaryInfo[summary.index].inSummary = true
        });
        return docsWithSummaryInfo
    }


    /*  Functions to create the Document (paragraphs of the article)   */

    function formatDocument(docs) {
        var formattedDocument = '';
        for (i = 0; i < docs.length; i++) {
            formattedDocument += paragraphConstructor(docs, i);
        }
        return formattedDocument;
    }

    function paragraphConstructor (docs, i) {
        let indexClass = (docs[i].inSummary === true) ? "index special-index":"index";
        var paragraph = '<div class="paragraph-container"><div class="' + indexClass + '"><p>' + i + '</p></div><div class="paragraph"><p>' + docs[i].text  + '</p></div></div>';
        return paragraph;
    }


    /*  Functions to create the summary   */

    function formatSummary(summaries, docs) {
        var formattedSummary = '';
        for (i = 0; i < summaries.length; i++) {
            summary = summaries[i];
            index = summary['index'];
            prediction = summary['prediction'];
            formattedSummary += summaryConstructor(summary, index, prediction, docs);
        }
        return formattedSummary;
    }

    function summaryConstructor(summary, index, prediction, docs) {
        // rounding off the numbers to three decimal places
        confidence = Math.round(prediction*1000)/1000;

        // Result structure of summaries
        var paragraph = ('<div class="summary-container"><div class="index special-index"><p>' + index + '</p></div><div class="summary-paragraph"><p>' + docs[index] + '&nbsp;<span class="confidence">(Score: ' + confidence + ')</span></p></div></div>');
        return paragraph;
    }

    /* -----------------------------        END EXTRACTIVE MODEL        -----------------------------   */

    /* -----------------------------        GENERATIVE MODELS        -----------------------------   */


    /*  Functions to create the Document (paragraphs of the article)   */

    function formatDocumentGen(docs) {
        var formattedDocumentGen = '';
        for (i = 0; i < docs.length; i++) {
            formattedDocumentGen += paragraphConstructorGen(docs, i);
        }
        return formattedDocumentGen;

  function paragraphConstructorGen (docs, i) {
        var paragraph = '<div class="paragraph-gen"><p>' + docs[i]  + '</p></div>';
        return paragraph;
    }

    /*      END       */


    /*  Function to create the generative summary   */

    function formatSummaryGen(summaries) {
        var formattedSummaryGen = ('<div class="summary-container"><div class="summary-paragraph-gen"><p>' + summaries +'</p></div></div>');
        return formattedSummaryGen;
    }

    /* -----------------------------        END GENERATIVE MODEL        -----------------------------   */


