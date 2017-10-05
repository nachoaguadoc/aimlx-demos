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


function decorate_intent(intent) {
    var list = ['I love your questions about <span class="blue"><intent></span>... :-)', 
                'Did you know that answering <span class="blue"><intent></span>  questions is my specialty ? ;-)', 
                'This is like the zillion-th question you ask me about <span class="blue"><intent></span> ...', 
                'Huh... this is the strangest question about <span class="blue"><intent></span> I have ever been asked...'];
    var random_number = Math.ceil(Math.random()*(list.length-1));
    var statement = list[random_number].replace('<intent>', intent);
    return statement
}

function new_opinion_answer(original, original_no_punctuation, labels, intent) {
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
        if (intent=='restaurant') {
            intent = 'restaurants and food';
        }
        else if (intent=='movie') {
            intent = 'movies';
        }
        else {
            intent = 'flights';
        }
        formatted_text = decorate_intent(intent)+ '<br><br>';
        var key_words = '';
		for (i = 0; i < l.length; i++) {
			if (l[i] == "O") {
				formatted_text += '<span>' + original_splitted[i] + ' </span>';
			} else {
				formatted_text += '<b>' + original_splitted[i] + ' </b>' + '<span style="color:Orchid">' + ' (' +  l[i].toLowerCase().substring(2, l[i].length)  + ') ' + ' </span>';
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



function submit(input_text) {
	console.log("Slot filling input:", input_text);
	$('#input_text').val('');
    var input_text_no_punctuation = input_text.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '')
    input_text_no_punctuation = input_text_no_punctuation.replace(/\s{2,}/g," ")
    input_text = input_text.replace(/\s+\?/g, '?')
    input_text = input_text.replace(/\s+!/g, '!')
    input_text = input_text.replace(/\s+\./g, '.')
    input_text = input_text.replace(/\s+,/g, ',')
	new_question(input_text_no_punctuation);
	url = "/sfid";
	var data = {"input": input_text_no_punctuation.toLowerCase()};
	$.ajax({
	  type: "POST",
	  url: url,
	  contentType: 'application/json',
	  data: JSON.stringify(data, null, '\t'),
	  success: function(data) {
        labels = data['labels'];
        intent = data['intent'];
        console.log(labels);
        console.log(intent);
        new_opinion_answer(input_text, input_text_no_punctuation, labels, intent);
	  }
	});
}
function load_suggestions(suggestions){
	clean()
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

$(document).ready(function(){
	$('#question_row').hide();
	learning_type = 'supervised'
	$.getJSON("../static/javascripts/lists/sfid.json", function(json) {
		suggestions = json.candidates;
		suggestions_random = get_random_suggestions(suggestions);
	    load_suggestions(suggestions_random);
	});
	
	$('#search_button').click(function(e){
		input_text = $('#input_text').val();
	    if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	})

	$('#input_text').keyup(function(e){
	    if(e.keyCode == 13) {
	    	input_text = $('#input_text').val();
	    	if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	    }
	});

	$('#refresh_button').click(function(e){
		refresh();
	})

	$('input:radio[name="learning"]').change( function(){
        if ($(this).is(':checked') && $(this).val() == 'supervised') {
            learning_type = 'supervised';
        } else {
        	learning_type = 'unsupervised';
        }
    });

});

