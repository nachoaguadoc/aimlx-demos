function new_question(question) {
	$('#question').text(question);
	$('#answer_nn').text('');
	$('#answer_solr').text('');
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
	$('.col-md-6').matchHeight();
	stop_spinner();
}


function submit(input_text) {
	console.log("Chatbot input:", input_text)
	$('#input_text').val('');
	new_question(input_text);
	url = "/chatbot/swisscom"
	$.ajax({
	  type: "POST",
	  url: url,
	  data: {"question": input_text},
	  dataType: 'text',
	  success: function(data) {
	  	data = JSON.parse(data);
	  	var nn = data.encoder;
	  	var solr = data.solr;
	  	new_chatbot_answer(nn, solr)
	  }
	});
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
	$('.robot').hide();
});
