function submit(input_text) {
	$("#last_group").append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
	console.log("url input: ", input_text)
	$('#input_text').val('');
	url = "/kp/" + input_text
	$.ajax({
	  type: "POST",
	  url: url,
	  data: input_text,
	  dataType: 'text',
	  success: function(data) {
	  	console.log(data)
	  	$('#kpvizu_div').html(data);
	  	$("#spinner").remove();
	  }
	});
}