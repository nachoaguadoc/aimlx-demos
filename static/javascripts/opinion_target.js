//suggestions = ['The food is tasty', 'The restaurant was very expensive', 'I think the steak was not very good', 'The fish was ok, but I the salad was better', 'The breakfast was delicious!', 'How much does these oranges cost?']
var suggestions = [];
function new_question(question) {
	$('#question_row').show();
	$('#question').text(question);
	$('#suggestions').text('');	
	$('#answer_baseline').text('');
	$('#answer_embeddings').text('');	
	$('.robot').hide();

	start_spinner();
}

function new_opinion_answer(original, labels) {
	console.log("Labels:", labels)
	formatted_text = ''
	labels_model = labels.split(" | ");
	var formatted_texts = [];
	for (var l in labels_model) {
		l = labels_model[l].split(" ");
		var original_splitted = original.split(" ");
		var formatted_text = '';
		for (i = 0; i < l.length; i++) {
			if (l[i] == "O") {
				formatted_text += '<span>' + original_splitted[i] + ' </span>';
			} else {
				formatted_text += '<span class="red">' + original_splitted[i] + ' </span>';
			}
		}
		formatted_texts.push(formatted_text);
	}
	$('#question_row').hide();
	$('.robot').show();
	$('#question').text('');
	suggestions_random = get_random_suggestions(suggestions);
    load_suggestions(suggestions_random);	
    $('#answer_baseline').html(formatted_texts[0]);
	$('#answer_embeddings').html(formatted_texts[1]);
	stop_spinner();
}


function submit(input_text) {
	console.log("Opinion target input:", input_text)
	$('#input_text').val('');
	new_question(input_text);
	url = "http://localhost:8080/opinion"
	$.ajax({
	  type: "POST",
	  url: url,
	  data: input_text,
	  dataType: 'text',
	  success: function(data) {
	  	new_opinion_answer(input_text, data)
	  }
	});
}
function load_suggestions(suggestions){
	clean()
	for (var c in suggestions) {
		$('#suggestions').html($('#suggestions').html() + '<div class="col-md-4 suggestion_box"><div class="panel panel-default suggestion"><div class="panel-body">' + suggestions[c] + ' </div></div></div>');
	}
	$('.suggestion .panel-body').matchHeight();
	$('.suggestion .panel-body').click(function(e){
		query = $(e.target).text();
		submit(query);
	})
}

function get_random_suggestions(suggestions) {
	var random_indexes = []
	while(random_indexes.length < 6){
	    var random_number = Math.ceil(Math.random()*(suggestions.length-1));
	    if(random_indexes.indexOf(random_number) > -1) continue;
	    random_indexes[random_indexes.length] = random_number;
	}

	suggestions_random = []
	for (var i in random_indexes) {
		suggestions_random.push(suggestions[random_indexes[i]]);
	}
	return suggestions_random
}
function clean() {
	$('#question').text('');
	$('#answer_baseline').text('');
	$('#answer_embeddings').text('');
	$('#suggestions').text('');
}
function refresh() {
	$('#question_row').hide();
	$('.robot').hide();

	suggestions_random = get_random_suggestions(suggestions);
	load_suggestions(suggestions_random);
}

$(document).ready(function(){
	$('#question_row').hide();

	$.getJSON("../javascripts/lists/opinion_mining.json", function(json) {
		suggestions = json.candidates;
		suggestions_random = get_random_suggestions(suggestions);
	    load_suggestions(suggestions_random);
	});
	
	$('#search_button').click(function(e){
		input_text = $('#input_text').val();
	    if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	})
	$('#refresh_button').click(function(e){
		refresh();
	})
});

