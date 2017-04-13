function start_spinner() {
	$('#question').append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
}

function stop_spinner() {
	$('#spinner').remove();
}