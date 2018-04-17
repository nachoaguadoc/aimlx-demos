var urlDoc, language, mode;
var MultilingualLayout = {
    samples: [],
    langsamples: [],
    sampleLink: '',
    numberOfSamples: 4,
    samplesDisplay: [],
    languages: [],
    isLoading: false,
    dataInput: '',
    minInputLength: 2,
    config: function (options) {
        this.initializeUiEventHandler();
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
            self.langsamples = json.languages;
            console.log("loading samples");
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
        this.languagesDisplay = [];
        if (this.samples.length > this.numberOfSamples) {
            var randomIndexes = [];
            while (randomIndexes.length < this.numberOfSamples) {
                var randomNumber = Math.ceil(Math.random() * (this.samples.length - 1));
                if (randomIndexes.indexOf(randomNumber) > -1) continue;
                randomIndexes[randomIndexes.length] = randomNumber;
            }
            var trueIndexes = Array.apply(null, Array(this.numberOfSamples)).map(function (_, i) {return i;});
            for (var i in randomIndexes) {
                this.samplesDisplay.push(this.samples[randomIndexes[i]]);
                this.languagesDisplay.push(this.langsamples[randomIndexes[i]]);
            }
        } else {
            this.samplesDisplay = this.samples;
            this.languagesDisplay = this.langsamples;

        }
        this.showSamples();
    },
    showSamples: function () {
        $('#sample-data').empty();
        for (var i in this.samplesDisplay) {
            var maxLenght = 1000;
            var self = this;
            var sampleText = this.samplesDisplay[i];
            if (sampleText.length > maxLenght) {
                sampleText = sampleText.substring(0, (maxLenght-3)) + '...'
            }
            $('#sample-data').append('<div class="col-md-6"><div id="sample-' + [i] + '" data-index="' + [i] + '" class="sample-box">' + sampleText + '</div></div>');

            $('#sample-' + [i]).on('click', function (e) {
                if (!self.isLoading) {
                    urlDoc = self.samplesDisplay[$(e.target).data('index')];
                    $(this).prop('title', urlDoc);
                    $("#url-submit").prop('disabled', true);
                    $(this).css('background-color', '#99ccff');
                    language = self.languagesDisplay[$(e.target).data('index')];
                    mode = "sample";
                    $('.sample-box--selected').removeClass('sample-box--selected');
                    $(this).addClass('sample-box--selected');
                    $('#btn-submit').removeClass('disabled');
                }
            });
        }
    },
    setLoadingState: function () {
        this.isLoading = true;
        $('#btn-submit').addClass('disabled');
        $('#input-submit').prop('disabled', true);
    },


    initializeUiEventHandler: function () {
        var self = this;

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

MultilingualLayout.config(
    {
        sampleLink: "static/json/samples.json"
    }
);

function getRemote(urldoc, language, mode) {
    $("#legend_lang").empty();
    $('#btn-submit span').hide();
    $('#loader').removeClass("aix-invisible");
    $('#results').addClass("aix-invisible");
    var data = {"urldoc":urlDoc, "language": language, "mode": mode};
    console.log(data);
    $.ajax({
        type: "POST",
        url: "/multilingual/sendchoosedoc",
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function(data){
            console.log(data);
            var data_plot = [];
            var languages = [];
            for (var lang in data){
                console.log(lang);
                data_plot.push(data[lang]);
                languages.push(data[lang]["name"]);
            }
            console.log(data_plot);
            // Add Plotly here
            data
            var layout = {
              xaxis: {
                range: [ -30, 20 ]
              },
              yaxis: {
                range: [-20, 30]
              },
              title:'Hover over to check the content',
              hovermode: 'closest',
              showlegend:false,
              width:1000,
              height:1000
            };


            var myPlot = document.getElementById('myDiv'),
                d3 = Plotly.d3,
                data = data,
                layout = layout;

            var colors = ["blue", "orange", "green", "red"];
            var paddings = ["100px'>", "100px'>", "80px'>", "20px'>"];

            var i = 0;
            //var colors = Plotly.d3.scale.category20();
            for(var j=0; j < languages.length; j++){
                var legend_part1 = "<svg height='30' width='30'> <circle cx='15' cy='15' r='10' stroke=";
                var legend_part2 = "stroke-width='3' fill=";
                var legend_part3 = "/></svg><span style='padding-right:";
                var legend_part4 = "</span>";
                var legend_lang = legend_part1.concat(colors[i]).concat(legend_part2).concat(colors[i]).
                concat(legend_part3).concat(paddings[j]).concat(languages[j]).concat(legend_part4);
                $("#legend_lang").append(legend_lang);
                i = i + 1;
            }

            Plotly.newPlot('myDiv', data_plot, layout);
            console.log("Clicked");

            myPlot.on('plotly_click', function(data){
                var pts = '';
                for(var i=0; i < data.points.length; i++){
                    pts = "Document = "+data.points[i].text
                    +'\nat x = '+data.points[i].x +'\ny = '+ data.points[i].y.toPrecision(4) + '\n\n';
                }
                alert('Closest document clicked:\n\n'+pts);
            });
            for (var i in MultilingualLayout.samplesDisplay) {
                $('#sample-' + [i]).css('background-color', '');
            }
            $('#btn-submit span').show();
            $('#loader').addClass("aix-invisible");
            $("#url-submit").prop('disabled', false);
            $('#legend').removeClass("aix-invisible");
            $('#results').removeClass("aix-invisible");

        },
        error: function(jqXHR, textStatus, errorMessage) {
            console.log(errorMessage); // Optional
       }
    });
}

$('#url-submit').keypress(function (e) {
    }).on('input', function () {
        urlDoc = this.value;
        mode = "url";
        $('#btn-submit').removeClass('disabled');
    }
    );

$(document).ready(function(){
    $('#btn-submit').click(function(e){
        var url = $('#url-submit').val();
        getRemote(urlDoc, language, mode);

     });
});