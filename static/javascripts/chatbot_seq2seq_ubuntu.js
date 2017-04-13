function new_question(question) {
	$('#question').text(question);
	$('#answer_seq2seq').text('');
	$('.robot').hide();
	start_spinner();
}

function new_chatbot_answer(seq2seq) {
	$('.robot').show();
	$('#answer_seq2seq').text(seq2seq);
	stop_spinner();
}


function submit(input_text) {
	console.log("Chatbot input:", input_text)
	$('#input_text').val('');
	new_question(input_text);
	url = "/chatbot/ubuntuseq2seq/" + input_text
	$.ajax({
	  type: "POST",
	  url: url,
	  data: input_text,
	  dataType: 'text',
	  success: function(data) {
	  	data = JSON.parse(data);
	  	var seq2seq = data.seq2seq;
	  	new_chatbot_answer(seq2seq)
	  }
	});
}

$(document).ready(function(){
	$('.robot').hide();
});
