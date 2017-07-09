answers_translate = {"word-match": " and perform a <b>word query</b>.", "print": " and <b>return</b> the results.", "count": " and return the <b>number</b> of results.", "group_by_max": " and <b>group</b> the elements by the query.", "max": " and obtain the <b>maximum</b> value.", "min": " and obtain the <b>minimum</b> value.", "greater": " and get the cells with value <b>greater</b> than the query.", "smaller": " and get the cells with value <b>smaller</b> than the query.", "geq": " and get the cells with value <b>greater or equal</b> than the query.", "leq": " and get the cells with value <b>smaller or equal</b> than the query.", "first_rs": " and get the <b>first</b> cell.", "last_rs": " and get the <b>last</b> cell.", "reset_select": " and <b>select all</b> the rows."}

var initial_tour = new Tour({
  steps: [
  {
    element: "#table_row",
    title: "Data table",
    content: "This table contains the information you can ask for.",
    placement: "top"
  },
  {
    element: "#custom-search-input",
    title: "Type here your question",
    content: "It should not be a complex question. Try with 'What is the position of Ronaldo?' or 'How many goals did Messi score?'. That kind of complexity.",
    placement: "left"
  },
  {
    element: "#custom-search-input",
    title: "Go ahead!",
    content: "Type your own question :)",
    placement: "left"
  }
]});

var answers_tour = new Tour({
  steps: [
  {
    element: "#answer",
    title: "Answer from our system",
    content: "This is the answer that the chatbot has given. How did we arrive here? ",
    placement: "bottom"
  },
  {
    element: "#step_0",
    title: "Hover over the step boxes!",
    content: "For each step we can see what was done over the selected column until we get to the final answer",
    placement: "top"
  },
  {
    element: "#custom-search-input",
    title: "Try as many times as you want!",
    content: "Type your own question :)",
    placement: "bottom"
  }
]});
var first_time = true;

function new_question(question) {
	$('#question').text(question);
	start_spinner();
	$("#answer_np").css('visibility', 'hidden');
	$("#debug").css('visibility', 'hidden');
	$('#answer_np').text('');
	$('#suggestions').text('');	
	$("#question").css('visibility', 'visible');
	clean_table();
}

function clean_table() {
	$("tr th").removeClass("highlighted");
	$("tr td").removeClass("highlighted");
	$("tr").removeClass("highlighted");
	$("tr td").removeClass("result");
}

function new_neural_programmer_answer(np, debug) {
	//$('#answer_np').text(np);
	$("#answer_np").css('visibility', 'visible');
	var steps = "";
	var last_rows = ""
	for (var i=0, l=debug.ops.length; i<l; i++) { 
		op = debug.ops[i];
		col = debug.cols[i];
		rows = debug.rows[i].replace(/ /g, ",");
		index = i+1;
		if (i == l -1) {
			var rows_selector = last_rows;
		}
		else {
			var rows_selector = JSON.parse(rows).join('-');
			last_rows = rows_selector;
		}
		steps += "<div class='col-md-4'><div id='step_" + i +  "' class='panel panel-default step col-md-10 steps_box'><div class='panel-heading'><h3 class='panel-title'>Step " + index +  "</h3></div><div class='panel-body'><span>Select the column <b><span rows=" + rows_selector + " class='col'>" + col + "</span></b>" + answers_translate[op] + "</span></div></div><span class='glyphicon glyphicon-arrow-right hidden right-arrow col-md-2'></div>"
	}

	steps += "<div class='col-md-4'><div id='answer' class='panel panel-primary step'><div class='panel-heading'><h3 class='panel-title'>Answer</h3></div><div class='panel-body'><span>" + np + "</span><span id='feedback'><span class='glyphicon glyphicon-ok-circle' id='correct'></span><span class='glyphicon glyphicon-remove-circle' id='wrong'></span></span></div></div></div>"
	$('#debug').html(steps);
	$("#debug").css('visibility', 'visible');
	suggestions_random = get_random_suggestions(suggestions);
    load_suggestions(suggestions_random);
	stop_spinner();

	//$('#step_0').css('visibility', 'visible').animate({opacity: 1.0}, 2000);
	setTimeout(function(){
	    $('#step_0').fadeIn(1500);
	    setTimeout(function(){
		    $('#step_1').fadeIn(1500)
		}, 500);
	}, 500);

	feedback_listeners();

    if (first_time) {
        console.log($('#answer'));
        first_time = false;
        initial_tour.end();
        answers_tour.end();
        setTimeout(function(){
            answers_tour.init();
            answers_tour.setCurrentStep(0);
            answers_tour.start(true);
        }, 2000);
    }
}

function feedback_listeners() {
	$('#correct').off('click');
	$('#wrong').off('click');
	
	$('#correct').click(function(e){
		last_question.correct = true;
		submit_feedback(last_question);
	})
	$('#wrong').click(function(e){
		last_question.correct = false;
		submit_feedback(last_question);
	})
}

var last_question = {"correct": false, "question": "", "answer": "", table_key: "", debug: {}};

function submit(input_text) {
	console.log("Neural Programmer input:", input_text)
	$('#input_text').val('');
	new_question(input_text);
	url = "/neural_programmer/question"
	//table_key = 'csv/203-csv/713.csv'
	table_key = 'csv/custom-csv/uefa.csv'
	processed_text = input_text.toLowerCase().replace('?',' ?')
	$.ajax({
	  type: "POST",
	  url: url,
	  data: {"question": processed_text, "table_key": table_key },
	  dataType: 'text',
	  success: function(data) {
		var data = JSON.parse(data).neural_programmer;
		data = data.replace(/'{/g, '{');
		data = data.replace(/}'/g, '}');
		data = data.replace(/"{/g, '{');
		data = data.replace(/}"/g, '}');
		data = data.replace(/'/g, '"');
		console.log(data)
		data = JSON.parse(data);
		var answer = data.answer;
		var debug = data.debugging;
		console.log("Debug:", debug);
		console.log("Answer:", answer);
		// Update last question info
		last_question.question = processed_text;
		last_question.answer = answer;
		last_question.table_key = table_key;
		last_question.debug = debug;
		new_neural_programmer_answer(answer, debug)
	  }	
	});
}

function submit_feedback(feedback) {
	// Correct: feedback = {correct:true, question: '', answer: '', table_key: '', lookup: false/true, cells: []}
	// Wrong: feedback = {correct: false, question: '', answer: '', table_key: '', lookup: false/true, cells: []}
	console.log("Feedback sent:", feedback);
	url = "/neural_programmer/feedback";
	$.ajax({
	  type: "POST",
	  url: url,
	  data: feedback,
	  dataType: 'text',
	  success: function(data) {
	  	console.log(data);
	  	if (feedback.correct) {
	  		$('#feedback').html("Thank you for your feedback!");
	  		$('#feedback').addClass("feedback")
	  	}
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
	    	if (input_text != '') {
	    		submit(input_text, $('#project_value').text().toLowerCase());
	    	}
	    }
	});

	$('#search_button').click(function(e){
		input_text = $('#input_text').val();
	    if (input_text != '') submit(input_text, $('#project_value').text().toLowerCase());
	})

	$.getJSON("../static/javascripts/lists/neural_programmer_uefa.json", function(json) {
		suggestions = json.questions;
		suggestions_random = get_random_suggestions(suggestions);
	  load_suggestions(suggestions_random);
	});
	
	$(document).on('mouseenter', '.steps_box', function() {
    	var col = $(this).find('.col')[0]
		var col_name = $(col).text().replace(/ /g, "_");
		col_name = col_name.slice(0, -1);
		$(".col-" + col_name).addClass("highlighted");
		var rows_selector = col.getAttribute('rows').split("-");
		for (var r in rows_selector) {
			row = parseInt(rows_selector[r]);
			var cells = $($('tr')[row+1])
			cells.addClass('highlighted')
			cells.children('td').each(function (){
				if ($(this).hasClass('highlighted')) {
					$(this).addClass("result");
				}
			})
		}
	})

    $(document).on('mouseleave', '.steps_box', function() {
    	var col = $(this).find('.col')[0]
		var col_name = $(col).text().replace(/ /g, "_");
		col_name = ".col-" + col_name.slice(0, -1);
		$(col_name).removeClass("highlighted");
		var rows_selector = col.getAttribute('rows').split("-");
		for (var r in rows_selector) {
			row = parseInt(rows_selector[r]);
			var cells = $($('tr')[row+1])
			cells.removeClass('highlighted')
			cells.children('td').each(function (){
				$(this).removeClass("highlighted");
				$(this).removeClass("result");
			})
		}
    })
	initial_tour.init();

    initial_tour.start();

	table = '<div id="table-wrap""><div id="table"><table class="clean table"><thead><tr><th class="col-player">Player</th><th class="col-nationality">Nationality</th><th class="col-team">Team</th><th class="col-titles">Titles</th><th class="col-age">Age</th><th class="col-salary">Salary</th><th class="col-position">Position</th><th class="col-matches">Matches Played</th><th class="col-goals">Goals</th><th class="col-assists">Assists</th><th class="col-yellow_cards">Yellow Cards</th><th class="col-red_cards"">Red Cards</th></tr></thead><tbody><tr><td class="col-player">Iker Casillas</td><td class="col-nationality">Spain</td><td class="col-team">FC Porto</td><td class="col-titles">3</td><td class="col-age">36</td><td class="col-salary">7.500.000€</td><td class="col-position">Goalkeeper</td><td class="col-matches">164</td><td class="col-goals">0</td><td class="col-assists">0</td><td class="col-yellow_cards">5</td><td class="col-red_cards"">0</td></tr><tr><td class="col-player">Cristiano Ronaldo</td><td class="col-nationality">Portugal</td><td class="col-team">Real Madrid CF</td><td class="col-titles">4</td><td class="col-age">32</td><td class="col-salary">32.000.000€</td><td class="col-position">Forward</td><td class="col-matches">140</td><td class="col-goals">105</td><td class="col-assists">31</td><td class="col-yellow_cards">16</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Andrés Iniesta</td><td class="col-nationality">Spain</td><td class="col-team">FC Barcelona</td><td class="col-titles">4</td><td class="col-age">33</td><td class="col-salary">14.000.000€</td><td class="col-position">Midfield</td><td class="col-matches">122</td><td class="col-goals">11</td><td class="col-assists">16</td><td class="col-yellow_cards">8</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Zlatan Ibrahimovic</td><td class="col-nationality">Sweden</td><td class="col-team">Manchester United</td><td class="col-titles">0</td><td class="col-age">35</td><td class="col-salary" class="col-salary">12.000.000€</td><td class="col-position">Forward</td><td class="col-matches">119</td><td class="col-goals">48</td><td class="col-assists">22</td><td class="col-yellow_cards">19</td><td class="col-red_cards">4</td></tr><tr><td class="col-player">Leo Messi</td><td class="col-nationality">Argentina</td><td class="col-team">FC Barcelona</td><td class="col-titles">4</td><td class="col-age" class="col-age">30</td><td class="col-salary">40.000.000€</td><td class="col-position">Forward</td><td class="col-matches" class="col-matches">115</td><td class="col-goals">94</td><td class="col-assists">24</td><td class="col-yellow_cards">14</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Petr Cech</td><td class="col-nationality">Czech Republic</td><td class="col-team">FC Arsenal</td><td class="col-titles">1</td><td class="col-age">35</td><td class="col-salary">7.000.000€</td><td class="col-position">Goalkeeper</td><td class="col-matches">111</td><td class="col-goals">0</td><td class="col-assists">0</td><td class="col-yellow_cards">4</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Gianluigi Buffon</td><td class="col-nationality">Italy</td><td class="col-team">Juventus FC</td><td class="col-titles">0</td><td class="col-age">39</td><td class="col-salary">4.000.000€</td><td class="col-position">Goalkeeper</td><td class="col-matches">108</td><td class="col-goals">0</td><td class="col-assists">0</td><td class="col-yellow_cards">2</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Sergio Ramos</td><td class="col-nationality">Spain</td><td class="col-team">Real Madrid CF</td><td class="col-titles">3</td><td class="col-age">31</td><td class="col-salary">10.000.000€</td><td class="col-position">Defender</td><td class="col-matches">103</td><td class="col-goals">10</td><td class="col-assists">6</td><td class="col-yellow_cards">32</td><td class="col-red_cards">3</td></tr></tbody></table></div></div>'
	//table = '<div id="table-wrap" style="height: 664px;"><div id="table"><table class="clean table"><thead><tr><th>S.No.</th><th>Name of Kingdom</th><th>Name of King</th><th>No. of villages</th><th>Capital</th><th>Names of districts</th></tr></thead><tbody><tr><td>1.</td><td>Sihag</td><td>Chokha Singh</td><td>150</td><td>Suin</td><td>Rawatsar, Baramsar, Purabsar Dandusar, Gandaisi</td></tr><tr><td>2.</td><td>Beniwal</td><td>Raisal Singh</td><td>150</td><td>Rasalana</td><td>Bhukarka, Sanduri, Manoharpur, Kooi, Bae</td></tr><tr><td>3.</td><td>Johiya</td><td>Sher Singh</td><td>600</td><td>Bhurupal</td><td>Jaitpur, Kumanu, Mahajan, Peepasar, Udasar</td></tr><tr><td>4.</td><td>Punia</td><td>Kanha Singh</td><td>300</td><td>Luddi</td><td>Bhadra, Ajitpura, Sidhmukh, Rajgarh, Dadrewa, Sankhoo</td></tr><tr><td>5.</td><td>Saharan</td><td>Pula Singh</td><td>300</td><td>Bhadang</td><td>Khejra, Phoglo, Buchawas, Sui, Badnu, Sirsila</td></tr><tr><td>6.</td><td>Godara</td><td>Pandu Singh</td><td>700</td><td>Shekhsar</td><td>Shekhsar, Pundrasar, Gusainsar (Bada), Gharsisar, Garibdesar, Rungaysar, Kalu</td></tr><tr><td>7.</td><td>Kaswan</td><td>Kanwarpal Singh</td><td>400</td><td>Sidhmukh</td><td></td></tr></tbody></table></div>    </div>'
	//table = '<div id="table-wrap""><div id="table"><table class="clean table"><thead><tr><th>Package</th><th>Broadband speed (Mbps)</th><th>International time (Minutes)</th><th>Roaming (Days)</th><th>Price (CHF)</th><th>Description</th></tr></thead><tbody><tr><td>InOne XL</td><td>200</td><td>1000</td><td>365</td><td>180</td><td>With highspeed internet, ideal for business</td></tr><tr><td>InOne L</td><td>200</td><td>300</td><td>365</td><td>120</td><td>Complete package thought for Erasmus students.</td></tr><tr><td>InOne M</td><td>200</td><td>100</td><td>60</td><td>90</td><td>Top seller package, ideal for teenagers to use the social media.</td></tr><tr><td>InOne S</td><td>20</td><td>60</td><td>45</td><td>70</td><td>Fast internet with an affordable price. Convenient for holidays abroad.</td></tr><tr><td>InOne XS</td><td>2</td><td>30</td><td>30</td><td>50</td><td>Package cheap, simple and easy.</td><tr></tbody></table></div></div>'
	$('#table_container').html(table)
});
