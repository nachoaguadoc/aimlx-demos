//suggestions = ['The food is tasty', 'The restaurant was very expensive', 'I think the steak was not very good', 'The fish was ok, but I the salad was better', 'The breakfast was delicious!', 'How much does these oranges cost?']
var suggestions = [];

function new_question(question) {
	$('#question_row').show();
	$('#question').text(question);
	$('#suggestions').text('');	
	$('#answer_baseline').text('');
	$('#answer_embeddings').text('');	

	start_spinner();
}

function new_opinion_answer(original, labels) {
	console.log("Labels:", labels)
	formatted_text = ''
	labels_model = [labels]
	console.log("Labels:", labels)

	//labels_model = labels.split(" | ");
	var formatted_texts = [];
	for (var l in labels_model) {
		l = labels_model[l].split(" ");
		var original_splitted = original.split(" ");
		var formatted_text = '';
		for (i = 0; i < l.length; i++) {
			if (l[i] == "O") {
				formatted_text += '<span>' + original_splitted[i] + ' </span>';
			} else {
				formatted_text += '<span class="blue">' + original_splitted[i] + ' </span>';
			}
		}
		formatted_texts.push(formatted_text);
	}
	$('#question_row').hide();
	$('#question').text('');
	suggestions_random = get_random_suggestions(suggestions);
    load_suggestions(suggestions_random);	
    $('#answer_baseline').html(formatted_texts[1]);
	$('#answer_embeddings').html(formatted_texts[0]);
	stop_spinner();
}



function submit(input_text,id) {
	console.log("Opinion target input:", input_text);
	console.log("Learning type", learning_type);
	$('#input_text').val('');
	new_question(input_text);
	url = "/grocery/static";
        var data = {"image_list": id+'.jpg'};

	$.ajax({
	  type: "POST",
	  url: url,
	  contentType: 'application/json',
	  data: JSON.stringify(data),
	  success: function(data) {
        labels = data['labels'];
        console.log(labels);
        $(location).attr('href','/grocery/processed');
//        new_opinion_answer(input_text, labels);
	  }
	});
}
function load_suggestions(suggestions){
	clean()
	for (var c in suggestions) {
		$('#suggestions').html($('#suggestions').html() + '<div class="col-md-4 suggestion_box"><div class="panel panel-default suggestion"><div class="panel-body"><img id=banner src="{{ url_for("static", filename="assets/swisscom-logo.png") }}"></img>'+'<p>hhhhhhhh</p>' + ' </div></div></div>');
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
function clean() {
	$('#question').text('');
	$('#answer_baseline').text('');
	$('#answer_embeddings').text('');
	$('#suggestions').text('');
}
function refresh() {
	$('#question_row').hide();

	suggestions_random = get_random_suggestions(suggestions);
	load_suggestions(suggestions_random);
}

function upload(formData){
    new_question('Uploading and Processing Image... Get a coffee :P');

$.ajax({
       url: "/grocery/upload",
       type: "POST",
       data: formData,
       processData: false,
       contentType: false,
       success: function(response) {
           $(location).attr('href','/grocery/processed');
       },
       error: function(jqXHR, textStatus, errorMessage) {
           console.log(errorMessage); // Optional
       }
    });
}


$(document).ready(function(){
	$('#question_row').hide();
	learning_type = 'supervised'
//	$.getJSON("../static/javascripts/lists/opinion_mining.json", function(json) {
//		suggestions = json.candidates;
//		suggestions_random = get_random_suggestions(suggestions);
//	    load_suggestions(suggestions_random);
//	});
	
	$('#search_button').click(function(e){
		input_text = $('#input_text').val();
	    if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	});

    $('#upload_button').click(function(e){
        var input = document.getElementById('input_file')
        var formData = new FormData();
        formData.append("fileToUpload", input.files[0]);
        upload(formData);
    });

	$('#img_sug1').click(function(e){
	    console.log("Image clicked!!");
	    submit('Processing Image.. Take a breath','static_8');
	});
	$('#img_sug2').click(function(e){
	    console.log("Image clicked!!");
	    submit('Processing Image.. Take a breath','static_14');
	});
	$('#img_sug3').click(function(e){
	    console.log("Image clicked!!");
	    submit('Processing Image.. Take a breath','static_17');
	});

	$('#img_sug4').click(function(e){
	    console.log("Image clicked!!");
	    submit('Processing Image.. Take a breath','static_73');
	});
	$('#img_sug5').click(function(e){
	    console.log("Image clicked!!");
	    submit('Processing Image.. Take a breath','static_6');
	});
	$('#img_sug6').click(function(e){
	    console.log("Image clicked!!");
	    submit('Processing Image.. Take a breath','static_13');
	});
	$('#img_sug7').click(function(e){
	    console.log("Image clicked!!");
	    submit('Processing Image.. Take a breath','static_5');
	});
	$('#img_sug8').click(function(e){
	    console.log("Image clicked!!");
	    submit('Processing Image.. Take a breath','static_16');
	});

	$('#input_text').keyup(function(e){
	    if(e.keyCode == 13) {
	    	input_text = $('#input_text').val();
	    	if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	    }
	});

	$("#banner").click(function(){
		window.location.replace("/grocery");
	})
	
	$("#home_button span").click(function(){
		window.location.replace("/grocery");
	})
	$('#refresh_button').click(function(e){
		refresh();
	});

	$('input:radio[name="learning"]').change( function(){
        if ($(this).is(':checked') && $(this).val() == 'supervised') {
            learning_type = 'supervised';
        } else {
        	learning_type = 'unsupervised';
        }
    });

});

