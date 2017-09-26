function submit(input_text, number_keyphrases) {
	$("#last_group").append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
	console.log("url input: ", input_text, 'number keyphrases', number_keyphrases);
	$('#input_text').val('');
	url = "/kp_emb";
	data = {'inp_url' : input_text,
	  'nbkp' : number_keyphrases
	  };
	$.ajax({
	  type: "POST",
	  url: url,
	  contentType: 'application/json',
	  data: JSON.stringify(data, null, '\t'),
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
            if (input_text != '') submit(input_text, number_keyphrases);
        }
    });

    $('#search_button').click(function(e){
        input_text = $('#input_text').val();
        number_keyphrases = $('#nbkp').val();
        if (input_text != '') submit(input_text, number_keyphrases);
    })
});
