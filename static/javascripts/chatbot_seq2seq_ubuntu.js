function new_question(question) {
	$('#question').text(question);
	$('#answer_seq2seq').text('');
	$('#suggestions').text('');	
	$('.robot').hide();
	start_spinner();
}

function new_chatbot_answer(seq2seq) {
	$('#answer_seq2seq').text(seq2seq);
	//suggestions_random = get_random_suggestions(suggestions);
    //load_suggestions(suggestions_random);
	stop_spinner();
}


function submit(input_text) {
	console.log("Chatbot input:", input_text)
	$('#input_text').val('');
	new_question(input_text);
	url = "/chatbot/ubuntuseq2seq"
	$.ajax({
	  type: "POST",
	  url: url,
	  data: {"question": input_text},
	  dataType: 'text',
	  success: function(data) {
	  	data = JSON.parse(data);
	  	var seq2seq = data.seq2seq;
	  	new_chatbot_answer(seq2seq)
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
	//$.getJSON("../static/javascripts/lists/chatbot_seq2seq_ubuntu.json", function(json) {
	//	suggestions = json.candidates;
	//	suggestions_random = get_random_suggestions(suggestions);
	//    load_suggestions(suggestions_random);
	//});
	$('.robot').hide();
});