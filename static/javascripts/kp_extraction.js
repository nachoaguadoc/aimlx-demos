//test = '[{"Unigram": ["rt 3872931", "trump 3838403", "t.co 3022203", "beyonc\u00e9 794472", "i 531411", "he 497123", "brexit 488121", "presid 467015", "donald 380704", "media 299867", "peopl 296995", "sai 290928", "new 290095", "about 285299", "what 282809", "grammi 258556", "so 257798", "just 247728", "press 241005", "us 237248"]}, {"Bigram": [" 5998720", "donald trump 275831", "president trump 233185", "press conference 104407", "nintendo switch 104226", "fake news 101428", "fifth harmony 91005", "videomtv2016 fifth 90794", "videomtv2016 fifth harmony 90794", "white house 88297", "american people 88280", "now2016 nowfifthharmony 83860", "samsung galaxy 78803", "now2016 nowfifthharmony videomtv2016 76273", "now2016 nowfifthharmony videomtv2016 fifth 76273", "now2016 nowfifthharmony videomtv2016 fifth harmony 76273", "nowfifthharmony videomtv2016 76273", "nowfifthharmony videomtv2016 fifth 76273", "nowfifthharmony videomtv2016 fifth harmony 76273", "harmony beyonc\u00e9 76261"]}]';
var suggestions = [];
function new_question(question) {
	$('#question_row').show();
	$('#results_row').text('');
	$('#question').text(question);

	start_spinner();
}

function new_kp_extraction_answer(data) {
	data = JSON.parse(data);
	n_cols = 6 / data.length;
	var first = true;
	for (d in data){
		method = Object.keys(data[d])[0];
		sentences = data[d][method];
		if (first) {
			//$('#results_row').html($('#results_row').html() + '<div class="col-md-1"></div>');
			$('#results_row').html($('#results_row').html() + '<div class="col-md-' + 3 + '"><img class="robot" id="r-clever" src="../assets/r-clever.png"></img></div>');
			$('#results_row').html($('#results_row').html() + '<div class="col-md-' + 2 + '" id="' + method + '"><div class="title_method">' + method + '</div></div>');
			first = false;
		} else {
			$('#results_row').html($('#results_row').html() + '<div class="col-md-' + 3 + '"><img class="robot" id="r-dumb" src="../assets/r-dumb.png"></img></div>');
			$('#results_row').html($('#results_row').html() + '<div class="col-md-' + 3 + '" id="' + method + '"><div class="title_method">' + method + '</div></div>');
			$('#results_row').html($('#results_row').html() + '<div class="col-md-1"></div>');

		}
		for (s in sentences) {
			$('#' + method).html($('#' + method).html() + '<div class="sentence">'+ sentences[s] +'</div>');
		}
	}
}

function submit() {

	source = $('input[name=sourceradio]:radio:checked').val()
	dates = $('input[name=datesradio]:radio:checked').val()
	methods = []
	$('input[name=methods_on]:checkbox:checked').each(function(){
    	methods.push($(this).val());
	})
	methods = methods.join('');
	filters=[]
	$('input[name=filters_on]:checkbox:checked').each(function(){
    	filters.push($(this).val());
	})
	filters = filters.join('');
	console.log("Source:", source, "Dates:", dates, "Methods:", methods, "Filters:", filters);
	if (!source || !dates || methods.length==0 || filters.length==0) {
		console.log("Not enough!")
	}
	url = "http://localhost:8080/kp";

	$.ajax({
	  type: "POST",
	  url: url,
	  data: {
	  	'source': source,
	  	'dates':dates,
	  	'methods': methods,
	  	'filters': filters

	  },
	  success: function(data) {
	  	new_kp_extraction_answer(data)
	  }
	});


}


function clean() {
	$('#question').text('');
	$('#answer_baseline').text('');
	$('#answer_embeddings').text('');
	$('#suggestions').text('');
}
function refresh() {
	$('#question_row').hide();

	suggestions_random = get_random_suggestions(suggestions);
	load_suggestions(suggestions_random);
}

$(document).ready(function(){

});

