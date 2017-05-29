function new_question(question) {
	$('#question').text(question);
	$('#answer_np').text('');
	$('#suggestions').text('');	
	start_spinner();
}

function new_neural_programmer_answer(np) {
	$('#answer_np').text(np);
	//suggestions_random = get_random_suggestions(suggestions);
    //load_suggestions(suggestions_random);
	stop_spinner();
}


function submit(input_text) {
	console.log("Neural Programmer input:", input_text)
	$('#input_text').val('');
	new_question(input_text);
	url = "/neural_programmer"
	//table_key = 'csv/203-csv/713.csv'
	table_key = 'csv/204-csv/custom-1.csv'
	$.ajax({
	  type: "POST",
	  url: url,
	  data: {"question": input_text, "table_key": table_key },
	  dataType: 'text',
	  success: function(data) {
	  	data = JSON.parse(data);
	  	var answer = data.neural_programmer;
	  	new_neural_programmer_answer(answer)
	  }
	});
}

function load_suggestions(suggestions){
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

	//$.getJSON("../static/javascripts/lists/chatbot_seq2seq_ubuntu.json", function(json) {
	//	suggestions = json.candidates;
	//	suggestions_random = get_random_suggestions(suggestions);
	//   load_suggestions(suggestions_random);
	//});

	
	//table = '<div id="table-wrap" style="height: 664px;"><div id="table"><table class="clean table"><thead><tr><th>S.No.</th><th>Name of Kingdom</th><th>Name of King</th><th>No. of villages</th><th>Capital</th><th>Names of districts</th></tr></thead><tbody><tr><td>1.</td><td>Sihag</td><td>Chokha Singh</td><td>150</td><td>Suin</td><td>Rawatsar, Baramsar, Purabsar Dandusar, Gandaisi</td></tr><tr><td>2.</td><td>Beniwal</td><td>Raisal Singh</td><td>150</td><td>Rasalana</td><td>Bhukarka, Sanduri, Manoharpur, Kooi, Bae</td></tr><tr><td>3.</td><td>Johiya</td><td>Sher Singh</td><td>600</td><td>Bhurupal</td><td>Jaitpur, Kumanu, Mahajan, Peepasar, Udasar</td></tr><tr><td>4.</td><td>Punia</td><td>Kanha Singh</td><td>300</td><td>Luddi</td><td>Bhadra, Ajitpura, Sidhmukh, Rajgarh, Dadrewa, Sankhoo</td></tr><tr><td>5.</td><td>Saharan</td><td>Pula Singh</td><td>300</td><td>Bhadang</td><td>Khejra, Phoglo, Buchawas, Sui, Badnu, Sirsila</td></tr><tr><td>6.</td><td>Godara</td><td>Pandu Singh</td><td>700</td><td>Shekhsar</td><td>Shekhsar, Pundrasar, Gusainsar (Bada), Gharsisar, Garibdesar, Rungaysar, Kalu</td></tr><tr><td>7.</td><td>Kaswan</td><td>Kanwarpal Singh</td><td>400</td><td>Sidhmukh</td><td></td></tr></tbody></table></div>    </div>'
	table = '<div id="table-wrap" style="height: 664px;"><div id="table"><table class="clean table"><thead><tr><th>Package</th><th>Internet speed (Mbps)</th><th>Minutes for international calls</th><th>Days of Roaming</th><th>Price</th></tr></thead><tbody><tr><td>InOne XL</td><td>200</td><td>1000</td><td>365</td><td>180</td></tr><tr><td>InOne L</td><td>200</td><td>300</td><td>365</td><td>120</td></tr><tr><td>InOne M</td><td>200</td><td>100</td><td>60</td><td>90</td></tr><tr><td>InOne S</td><td>20</td><td>60</td><td>45</td><td>70</td></tr><tr><td>InOne XS</td><td>2</td><td>30</td><td>30</td><td>60</td><tr></tbody></table></div></div>'

	$('#table_container').html(table)
});
