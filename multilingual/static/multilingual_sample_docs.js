function submit(data_py){
    $("#legend_lang").empty();
    $.ajax({
           url: "/multilingual/sendalldocs",
           type: "POST",
           data: data_py,
           processData: false,
           contentType: false,
           success: function(data) {
                console.log(data_py);
                var checkedGCAT = $('#GCAT').is(':checked');
                var checkedMCAT = $('#MCAT').is(':checked');
                var checkedCCAT = $('#CCAT').is(':checked');
                var checkedECAT = $('#ECAT').is(':checked');
                var checkedALLC = $('#ALLC').is(':checked');

                var checkeden = $('#en').is(':checked');
                var checkedde = $('#de').is(':checked');
                var checkedfr = $('#fr').is(':checked');
                var checkedit = $('#it').is(':checked');
                var checkedALLL = $('#ALLL').is(':checked');

                if (!checkeden && !checkedde && !checkedfr && !checkedit && !checkedALLL){
                    alert('Please check at least one language !');
                }
                if (!checkedGCAT && !checkedMCAT && !checkedCCAT && !checkedECAT && !checkedALLC){
                    alert('Please check at least one class !');
                }

                var checkClasses = [];
                if (checkedGCAT){
                    checkClasses.push("GCAT");
                }
                if (checkedMCAT){
                    checkClasses.push("MCAT");
                }
                if (checkedCCAT){
                    checkClasses.push("CCAT");
                }
                if (checkedECAT){
                    checkClasses.push("ECAT");
                }
                if (checkedALLC){
                    checkClasses.push("GCAT");
                    checkClasses.push("MCAT");
                    checkClasses.push("CCAT");
                    checkClasses.push("ECAT");
                }

                var symbol_dict = {"circle":"GCAT", "square": "MCAT",
                                "diamond": "CCAT", "cross": "ECAT"};

                var symbol_dict_1 = {"circle":"Government/Social", "square": "Markets",
                "diamond": "Corporate/Industrial", "cross": "Economics"};

                console.log(checkClasses);
                for (var lang in data_py){
                    console.log(lang);
                    var new_text = [];
                    var new_x = [];
                    var new_y = [];
                    var symbol = [];
                    console.log(data_py[lang]['text'].length);
                    for (var i=0; i<data_py[lang]['text'].length;i++){
                        var class_ = symbol_dict[data_py[lang]['marker']['symbol'][i]];
                        console.log(class_);
                        if (checkClasses.indexOf(class_) > -1){
                            console.log("found");
                            new_text.push(data_py[lang]['text'][i]);
                            console.log(data_py[lang]['text'][i]);
                            new_x.push(data_py[lang]['x'][i]);
                            new_y.push(data_py[lang]['y'][i]);
                            symbol.push(data_py[lang]['marker']['symbol'][i]);
                        }
                    }
                    data_py[lang]['text'] = new_text;
                    data_py[lang]['x'] = new_x;
                    data_py[lang]['y'] = new_y;
                    data_py[lang]['marker']['symbol'] = symbol;
                }

                console.log(data_py);

                var data = [];
                var languages = [];
                if (checkeden){
                    languages.push('English');
                    data.push(data_py['english']);
                }
                if (checkedde){
                    languages.push('German');
                    data.push(data_py['german']);
                }
                if (checkedfr){
                    languages.push('French');
                    data.push(data_py['french']);
                }
                if (checkedit){
                    languages.push('Italian');
                    data.push(data_py['italian']);
                }
                if (checkedALLL){
                    languages.push('English');
                    data.push(data_py['english']);
                    languages.push('German');
                    data.push(data_py['german']);
                    languages.push('French');
                    data.push(data_py['french']);
                    languages.push('Italian');
                    data.push(data_py['italian']);
                }

                console.log(data);

                var layout = {
                  xaxis: {
                    range: [ -10, 15 ]
                  },
                  yaxis: {
                    range: [-20, 15]
                  },
                  title:'Hover over to check the content',
                  hovermode: 'closest',
                  showlegend: false,
                  width: 900,
                  height: 800
                };

                var myPlot = document.getElementById('myDiv'),
                    d3 = Plotly.d3,
                    data = data,
                    layout = layout;

                var colors = ["blue", "orange", "green", "red"];

                var i = 0;
                for(var j=0; j < languages.length; j++){
                    var legend_part1 = "<svg height='30' width='30'> <circle cx='15' cy='15' r='10' stroke=";
                    var legend_part2 = "stroke-width='3' fill=";
                    var legend_part3 = "/></svg><span>";
                    var legend_part4 = "</span>";
                    var legend_lang = legend_part1.concat(colors[i]).concat(legend_part2).concat(colors[i]).
                    concat(legend_part3).concat(languages[j]).concat(legend_part4);
                    $("#legend_lang").append(legend_lang);
                    i = i + 1;
                }

                $('#btn-submit span').show();
                $('#loader').addClass("aix-invisible");
                Plotly.newPlot('myDiv', data, layout);
                console.log("Clicked");
                $('#results').removeClass("aix-invisible");
                $('#legend').removeClass("aix-invisible");

                myPlot.on('plotly_click', function(data){
                    var pts = '';
                    for(var i=0; i < data.points.length; i++){
                        pts = "Document = "+data.points[i].text
                        +'\nat x = '+data.points[i].x +'\ny = '+ data.points[i].y.toPrecision(4) + '\n\n';
                    }
                    alert('Closest document clicked:\n\n'+pts);
                });
           },
           error: function(jqXHR, textStatus, errorMessage) {
               console.log(errorMessage); // Optional
           }
    });

 }

$(document).ready(function(){

    var clicksClass = 0;
    $("#ALLC").click( function() {
       if (clicksClass % 2==0) {
            $('#GCAT').attr('disabled', 'disabled');
            $('#MCAT').attr('disabled', 'disabled');
            $('#CCAT').attr('disabled', 'disabled');
            $('#ECAT').attr('disabled', 'disabled');
        } else {
            $('#GCAT').removeAttr('disabled');
            $('#MCAT').removeAttr('disabled');
            $('#CCAT').removeAttr('disabled');
            $('#ECAT').removeAttr('disabled');
        }
        ++ clicksClass;
    });

    var clicksLang = 0;
    $("#ALLL").click( function() {
       if (clicksLang % 2==0) {
            $('#en').attr('disabled', 'disabled');
            $('#de').attr('disabled', 'disabled');
            $('#it').attr('disabled', 'disabled');
            $('#fr').attr('disabled', 'disabled');
        } else {
            $('#en').removeAttr('disabled');
            $('#de').removeAttr('disabled');
            $('#it').removeAttr('disabled');
            $('#fr').removeAttr('disabled');
        }
        ++ clicksLang;
    });

    $('#choose-mode').click(function(e){});

    $('#btn-submit').click(function(e){
        $('#btn-submit span').hide();
        $('#loader').removeClass("aix-invisible");
        $.getJSON('static/json/new_json_neighbours.json', function(data) {
            submit(data);
        });
     });

});