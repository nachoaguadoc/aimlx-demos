function start_spinner() {
	$('#question').append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
}

function stop_spinner() {
	$('#spinner').remove();
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
	
});