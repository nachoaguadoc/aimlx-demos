//suggestions = ['The food is tasty', 'The restaurant was very expensive', 'I think the steak was not very good', 'The fish was ok, but I the salad was better', 'The breakfast was delicious!', 'How much does these oranges cost?']
var suggestions = [];
function new_question(question) {
	$('#question_row').show();
	$('#question').text(question);
	$('#suggestions').text('');	
	$('#answer_baseline').text('');
	$('#answer_embeddings').text('');	

	start_spinner();
}

function new_opinion_answer(original, labels) {
	console.log("Labels:", labels)
	formatted_text = ''
	labels_model = [labels]
	console.log("Labels:", labels)

	//labels_model = labels.split(" | ");
	var formatted_texts = [];
	for (var l in labels_model) {
		l = labels_model[l].split(" ");
		var original_splitted = original.split(" ");
		var formatted_text = '';
		for (i = 0; i < l.length; i++) {
			if (l[i] == "O") {
				formatted_text += '<span>' + original_splitted[i] + ' </span>';
			} else {
				formatted_text += '<span class="blue">' + original_splitted[i] + ' </span>';
			}
		}
		formatted_texts.push(formatted_text);
	}
	$('#question_row').hide();
	$('#question').text('');
	suggestions_random = get_random_suggestions(suggestions);
    load_suggestions(suggestions_random);	
    $('#answer_baseline').html(formatted_texts[1]);
	$('#answer_embeddings').html(formatted_texts[0]);
	stop_spinner();
}



function submit(input_text) {
	console.log("Opinion target input:", input_text);
	console.log("Learning type", learning_type);
	$('#input_text').val('');
	new_question(input_text);
	url = "/opinion";
	var data = {"input": input_text, "learning": learning_type};
	$.ajax({
	  type: "POST",
	  url: url,
	  contentType: 'application/json',
	  data: JSON.stringify(data, null, '\t'),
	  success: function(data) {
	  	answer = JSON.parse(data);
        labels = answer['labels'];
        console.log(labels);
        new_opinion_answer(input_text, labels);
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

	suggestions_random = get_random_suggestions(suggestions);
	load_suggestions(suggestions_random);
}

$(document).ready(function(){
	$('#question_row').hide();
	learning_type = 'supervised'
	$.getJSON("../static/javascripts/lists/opinion_mining.json", function(json) {
		suggestions = json.candidates;
		suggestions_random = get_random_suggestions(suggestions);
	    load_suggestions(suggestions_random);
	});
	
	$('#search_button').click(function(e){
		input_text = $('#input_text').val();
	    if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	})

	$('#input_text').keyup(function(e){
	    if(e.keyCode == 13) {
	    	input_text = $('#input_text').val();
	    	if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	    }
	});

	$('#refresh_button').click(function(e){
		refresh();
	})

	$('input:radio[name="learning"]').change( function(){
        if ($(this).is(':checked') && $(this).val() == 'supervised') {
            learning_type = 'supervised';
        } else {
        	learning_type = 'unsupervised';
        }
    });

});

