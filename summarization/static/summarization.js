var SummarizationLayout = {
    samples: [],
    sampleLink: '',
    numberOfSamples: 8,
    samplesDisplay: [],
    isLoading: false,
    mode: 0,
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
        $('#btn-submit').addClass('disabled');
        $('#url-submit').prop('disabled', true);
        $('#tab-results').hide();
        $('#aix-result-document').empty();
        $('#aix-result-summary').empty();
    },
    showResults: function (doc, summary) {
        if (this.isLoading) {
            this.isLoading = false;
            $('#url-submit').prop('disabled', false).val('');
            $('#aix-result-document').append(doc);
            $('#aix-result-summary').append(summary);
            $('#tab-results').show();

        }
    },
    submit: function () {
        if (this.dataInput.length > this.minInputLength && !this.isLoading && this.mode != 0) {
            this.submitFunction(this.dataInput, this.mode);
            this.setLoadingState();
        }
    },
    mode_select: function(mode_type) {
        $('#error-message').hide();
        this.mode=mode_type;
        this.check_completion();
    },
    check_completion: function(){
        if (this.dataInput.length > this.minInputLength && this.mode != 0) {
             $('#btn-submit').removeClass('disabled');
        } else {
             $('#btn-submit').addClass('disabled');
         }
    },

    initializeUiElements: function () {
        var self = this;
        $('#tab-results').hide();
        $('#aix-result-document').empty();
        $('#aix-result-summary').empty();
        $('#btn-submit').on('click', function () {
            self.submit();
        });

        $('#radio-ext').on('click', function () {
            self.mode_select(1);
        });
        $('#radio-gen').on('click', function () {
            self.mode_select(2);
        });
        $('#radio-gen-old').on('click', function () {
            self.mode_select(3);
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
            var formattedSummary = formatSummary(summary, mode)
            SummarizationLayout.showResults(formattedDocument, formattedSummary);
        }
    });
}

function formatDocument(doc) {
    var array_length = doc.length;
    var text = '<p>' + '<span>'
    for(var i = 0; i < array_length; i++){
        text = text + doc[i]
    }
    text = text + '</span>' + '</p>'
   // var formattedText = ('<p>' + '<span>'+ doc + '</span>' + '</p>')
    return text
}

function formatSummary(summary, mode) {
    var text = '<p>' + '<span>'
    if (mode >= 2){
        for(var i = 0; i < summary.length; i++){
            text = text + summary[i]
        }
    }
    else {
        for(var i = 0; i < summary.length; i++){
            current = summary[i]
            text = text + '['+current['index'] + '] (' + current['prediction'] + ') ' + current['text']
            text = text + '<br>'
         }
    }
    text = text + '</span>' + '</p>'
    //var formattedText = ('<p>' + '<span>'+ summary + '</span>' + '</p>')
    //return formattedText
    return text
}
