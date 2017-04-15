function submit(input_text) {
	$("#last_group").append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
	console.log("url input: ", input_text);
	$('#input_text').val('');
	url = "/kp";
	$.ajax({
	  type: "POST",
	  url: url,
	  data: {'inp_url' : input_text},
	  dataType: 'text',
	  success: function(data){
	  	console.log(data);
	  	$('#kpvizu_div').html(data);
	  	$("#spinner").remove();
	  }
	});
}

$(document).ready(function(){

    $('#input_text').keyup(function(e){
        if(e.keyCode == 13) {
            input_text = $('#input_text').val();
            if (input_text != '') submit(input_text, $('#project_value').text());
        }
    });

    $('#search_button').click(function(e){
        input_text = $('#input_text').val();
        if (input_text != '') submit(input_text, $('#project_value').text());
    })
});
