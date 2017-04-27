function submit(input_text, number_keyphrases, window_size, ilp) {
	$("#last_group").append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
	console.log("url input: ", input_text, 'number keyphrases', number_keyphrases, 'window_size', window_size, 'ilp', ilp);
	$('#input_text').val('');
	url = "/kp";
	$.ajax({
	  type: "POST",
	  url: url,
	  data: {'inp_url' : input_text,
	  'nbkp' : number_keyphrases,
	  'window_size' : window_size,
	  'ilp' : ilp
	  },
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
            number_keyphrases = $('#nbkp').val();
            window_size = $('#window').val();
            ilp = $('#ilp').is(':checked');
            if (input_text != '') submit(input_text, number_keyphrases, window_size, ilp);
        }
    });

    $('#search_button').click(function(e){
        input_text = $('#input_text').val();
        number_keyphrases = $('#nbkp').val();
        window_size = $('#window').val();
        ilp = $('#ilp').is(':checked');
        if (input_text != '') submit(input_text, number_keyphrases, window_size, ilp);
    })
});
