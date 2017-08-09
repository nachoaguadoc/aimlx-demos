//suggestions = ['The food is tasty', 'The restaurant was very expensive', 'I think the steak was not very good', 'The fish was ok, but I the salad was better', 'The breakfast was delicious!', 'How much does these oranges cost?']
var suggestions = [];
function new_question(question) {
    start_spinner();
}

function answer(input_text, translated_text) {
    $('#translated_text').text(translated_text);
	stop_spinner();
}


function submit(input_text) {
	new_question(input_text);
	data = {"text": input_text};
	url = "gsw";
	$.ajax({
	  type: "POST",
	  url: url,
	  contentType: 'application/json',
	  data: JSON.stringify(data, null, '\t'),
	  success: function(data) {
        translated_text = data['text'];
	  	answer(input_text, translated_text)
	  }
	});
}

// function load_suggestions(suggestions){
// 	clean()
// 	for (var c in suggestions) {
// 		$('#suggestions').html($('#suggestions').html() + '<div class="col-md-4 suggestion_box"><div class="panel panel-default suggestion"><div class="panel-body">' + suggestions[c] + ' </div></div></div>');
// 	}
// 	$('.suggestion .panel-body').matchHeight();
// 	$('.suggestion .panel-body').click(function(e){
// 		query = $(e.target).text();
// 		submit(query);
// 	})
// }

// function get_random_suggestions(suggestions) {
// 	var random_indexes = []
// 	while(random_indexes.length < 6){
// 	    var random_number = Math.ceil(Math.random()*(suggestions.length-1));
// 	    if(random_indexes.indexOf(random_number) > -1) continue;
// 	    random_indexes[random_indexes.length] = random_number;
// 	}
//
// 	suggestions_random = []
// 	for (var i in random_indexes) {
// 		suggestions_random.push(suggestions[random_indexes[i]]);
// 	}
// 	return suggestions_random
// }


$(document).ready(function(){
	$('#question_row').hide();

	// $.getJSON("../static/javascripts/lists/ner.json", function(json) {
	// 	suggestions = json.candidates;
	// 	suggestions_random = get_random_suggestions(suggestions);
	//     load_suggestions(suggestions_random);
	// });

	$('#search_button').click(function(e){
		input_text = $('#input_text').val();
	    if (input_text != '') submit(input_text);
	})
});

