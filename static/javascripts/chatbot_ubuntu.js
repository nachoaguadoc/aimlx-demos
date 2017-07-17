function new_question(question) {
	$('#question').text(question);
	$('#answer_nn').text('');
	$('#answer_solr').text('');
	$('#suggestions').text('');	
	$('.robot').hide();
	start_spinner();
}

function new_chatbot_answer(candidates_nn, candidates_solr) {
	$('.robot').show();

   	for (c in candidates_nn) {
		$('#answer_nn').html($('#answer_nn').html() + '<div class="col-md-12 answer_box"><div class="panel panel-default neural"><div class="panel-body">' + candidates_nn[c] + ' </div></div></div>');
	}
	for (c in candidates_solr) {
		$('#answer_solr').html($('#answer_solr').html() + '<div class="col-md-12 answer_box"><div class="panel panel-default benchmark"><div class="panel-body">' + candidates_solr[c] + ' </div></div></div>');
	}
    //suggestions_random = get_random_suggestions(suggestions);
    //load_suggestions(suggestions_random);	
	//$('.col-md-6').matchHeight();
	stop_spinner();
}


function submit(input_text) {
	console.log("Chatbot input:", input_text)
	$('#input_text').val('');
	new_question(input_text);
	url = "/chatbot/ubuntu";
	$.ajax({
	  type: "POST",
	  url: url,
	  data: {'question': input_text},
	  dataType: 'text',
	  success: function(data) {
	  	data = JSON.parse(data);
	  	var nn = data.encoder;
	  	var solr = data.solr;
	  	new_chatbot_answer(nn, solr)
	  }
	});
}

function load_suggestions(suggestions){
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

$(document).ready(function(){

	$('#input_text').keyup(function(e){
	    if(e.keyCode == 13) {
	    	input_text = $('#input_text').val();
	    	if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	    }
	});

	$('#search_button').click(function(e){
		input_text = $('#input_text').val();
	    if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	})
	//$.getJSON("../static/javascripts/lists/chatbot_ubuntu.json", function(json) {
	//	suggestions = json.candidates;
	//	suggestions_random = get_random_suggestions(suggestions);
	//    load_suggestions(suggestions_random);
	//});
	$('.robot').hide();
});