answers_translate = {"word-match": " and perform a <b>word query</b>.", "print": " and <b>return</b> the results.", "count": " and return the <b>number</b> of results.", "group_by_max": " and <b>group</b> the elements by the query.", "max": " and obtain the <b>maximum</b> value.", "min": " and obtain the <b>minimum</b> value.", "greater": " and get the cells with value <b>greater</b> than the query.", "smaller": " and get the cells with value <b>smaller</b> than the query.", "geq": " and get the cells with value <b>greater or equal</b> than the query.", "leq": " and get the cells with value <b>smaller or equal</b> than the query.", "first_rs": " and get the <b>first</b> cell.", "last_rs": " and get the <b>last</b> cell.", "reset_select": " and <b>select all</b> the rows."}
var suggestions_activated = false;
var initial_tour = new Tour({
	steps: [
	{
		element: "#table_row",
		title: "Data table",
		content: "This table contains the information you can ask for",
		placement: "top"
	},
	{
		element: "#custom-search-input",
		title: "What it does",
		content: "The bot answers simple questions about the table",
		placement: "bottom"
	},
	{
		element: "#custom-search-input",
		title: "Go ahead!",
		content: "Let's try with a predefined question! Press enter or End Tour when you are ready.",
		placement: "bottom",
		onShown: function (tour) {
			var question = "What players come from Spain?";
			var element = document.getElementById("input_text");
			function type(string,element){
			    (function writer(i){
			      if(string.length <= i++){
			        element.value = string;
			        return;
			      }
			      element.value = string.substring(0,i);
			      if( element.value[element.value.length-1] != " " )element.focus();
			      var rand = Math.floor(Math.random() * (50)) + 100;
			      setTimeout(function(){writer(i);},rand);
			    })(0)
			}
			type(question, element);
		},
		onHidden: function (tour) {
			$("#search_button").click();
		}
	},
	]
});

var answers_tour = new Tour({
  steps: [
  {
    element: "#answer",
    title: "Help us improve",
    content: "You can give feedback to the bot answers. In this case the answer is perfect, so you can make us know how awesome this is with the green button",
    placement: "bottom"
  },
  {
    element: "#answer",
    title: "Help us improve",
    content: "However, the bot is still learning. If the answer is wrong, click on the red button to give us a hand to keep improving :)",
    placement: "bottom"
  },
  {
    element: "#answer",
    title: "Thank you!",
    content: "That's all. Thank you for your help",
    placement: "bottom"
  },
]});

var feedback_cells_tour = new Tour({
  steps: [
  {
    element: "#answer",
    title: "Table cells",
    content: "For example, for 'How many players are older than 35?' you have to select 'Iker Casillas' and 'Gianluigi Buffon'",
    placement: "top"
  }
]});

var feedback_op_tour = new Tour({
  steps: [
  {
    element: "#answer",
    title: "Operation",
    content: "What should we do with the selected cells? If your answer involves other arithmetic operations, click 'Other'",
    placement: "bottom"
  }
]});

var first_time = true;
var first_feedback = true;

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
	$(".table tbody").removeClass('selectable');
	$("tr td").removeClass("feedback_cell");
	$("tr th").removeClass("highlighted");
	$("tr td").removeClass("highlighted");
	$("tr").removeClass("highlighted");
	$("tr td").removeClass("result");
	$('tr td').off('click');
}

function new_neural_programmer_answer(np, debug) {
	//$('#answer_np').text(np);
	answers_tour.end();
	$("#answer_np").css('visibility', 'visible');
	var steps = "";
	var last_rows = ""
	for (var i=0, l=debug.steps.length; i<l; i++) { 
		steps += "<div class='col-md-4'></div>"
	}

	steps += "<div class='col-md-4'><div id='answer' class='panel panel-primary answer_box step'><div class='panel-heading'><h3 class='panel-title'>Answer</h3></div><div id='to_replace' class='panel-body'><span>" + np + "</span><span id='feedback'><span class='glyphicon glyphicon-ok-circle' id='correct'></span><span class='glyphicon glyphicon-remove-circle' id='wrong'></span></span></div></div></div>"
	$('#debug').html(steps);
	$("#debug").css('visibility', 'visible');
	if (suggestions_activated) {
		suggestions_random = get_random_suggestions(suggestions);
	    load_suggestions(suggestions_random);
	}
	stop_spinner();

	feedback_listeners();

	/*
    if (first_time) {
    	create_new_cookie('simple_user_id');
        first_time = false;
        initial_tour.end();
        answers_tour.end();
        setTimeout(function(){
            answers_tour.init();
            answers_tour.setCurrentStep(0);
            answers_tour.start(true);
        }, 1000);
    } */
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
		$('.answer_box .panel-heading .panel-title').text("Feedback");
		$('#to_replace').html("<div><span>Please, select the cells of the table needed to get the correct answer.<span><button id='next' class='btn btn-primary'>Done</button>");
		$("#table").effect("shake", {duration:1000, times: 10, distance:2, direction: "left"});

	    if (first_feedback) {
	        initial_tour.end();
	        answers_tour.end();
	        feedback_cells_tour.end();
	        setTimeout(function(){
	            feedback_cells_tour.init();
	            feedback_cells_tour.setCurrentStep(0);
	            feedback_cells_tour.start(true);
	        }, 1000);
	    }
		$(".table tbody").addClass('selectable');
		var selected_cells = [];
		$('td').click(function(e){
			var row = this.parentNode.rowIndex-1;
			var col = this.cellIndex;
			var cell = row + "," +  col;
			var cell_index = selected_cells.indexOf(cell);
			if (cell_index == -1) selected_cells.push(cell);
			else selected_cells.splice(cell_index, 1);
			$(this).toggleClass('feedback_cell');
		});
		$('#next').click(function(e){
			feedback_cells_tour.end();
			if (selected_cells.length > 0) {
				$('#to_replace').html("<div><span>The answer is the number of cells, their content or neither?<span><button id='content' class='btn btn-success'>Content</button><button id='count' class='btn btn-primary'>Count</button><button id='other' class='btn btn-danger'>Other</button>");
				// Wrong: feedback = {correct: false, question: '', answer: '', table_key: '', is_lookup: false/true, cells: []}
			    if (first_feedback) {
			    	create_new_cookie('first_feedback');
			    	first_feedback = false;
			        initial_tour.end();
			        answers_tour.end();
			        feedback_cells_tour.end();
			        feedback_op_tour.end()
			        setTimeout(function(){
			            feedback_op_tour.init();
			            feedback_op_tour.setCurrentStep(0);
			            feedback_op_tour.start(true);
			        }, 1000);
			    }

				$('#count').click(function(e){
					feedback_op_tour.end()
					last_question.is_lookup_feedback = false;
					last_question.custom_input = false;
					last_question.answer_feedback = [selected_cells.length];
					last_question.cells_answer_feedback = selected_cells;

					$(".table tbody").removeClass('selectable');
					$('tr td').off('click');
					submit_feedback(last_question);
					$('#to_replace').html("<div>Submitted answer: <b>" + last_question.answer_feedback + "</b>.</div><div>Thank you for your feedback!</div>");
				})
				$('#content').click(function(e){
					feedback_op_tour.end()
					last_question.is_lookup_feedback = true;
					last_question.cells_answer_feedback = selected_cells;
					last_question.custom_input = false;
					var table = $("table")[0];
					var answer = '';
					for (var i in selected_cells) {
						var cell = selected_cells[i].split(',');
						var row = parseInt(cell[0])+1;
						var col = parseInt(cell[1]);
						var cell = table.rows[row].cells[col]; // This is a DOM "TD" element
						var text = $(cell).text();
						last_question.answer_feedback.push(text)
						answer += text + ", ";
					}
					answer = answer.substring(0, answer.length-2);
					$(".table tbody").removeClass('selectable');
					$('tr td').off('click');
					submit_feedback(last_question);
					$('#to_replace').html("<div>Submitted answer: <b>" + answer + "</b>.</div><div> Thank you for your feedback!</div>");
				})
				$('#other').click(function(e){
					feedback_op_tour.end();
					last_question.is_lookup_feedback = false;
					last_question.cells_answer_feedback = selected_cells;

					$('#to_replace').html("<div>Type here the correct answer:</div><input id='submitted_input' type='text'></input><button id='submit' class='btn btn-primary'>Submit</button>");
					$('#submit').click(function(e){
						last_question.answer_feedback = $("#submitted_input").val();
						last_question.custom_input = true;
						$(".table tbody").removeClass('selectable');
						$('tr td').off('click');
						submit_feedback(last_question);
						$('#to_replace').html("<div>Submitted answer: <b>" + last_question.answer_feedback + "</b>.</div><div>Thank you for your feedback! Ask another question :)</div>");
						$("#input_text").focus();
					})
				})			
			}
		});
	})
}

var last_question = {}

function submit(input_text) {
	console.log("Neural Programmer input:", input_text)
	$('#input_text').val('');
	new_question(input_text);
	url = "/neural_programmer/question"
	//table_key = 'csv/203-csv/713.csv'
	
	table_key = 'csv/custom-csv/uefa.csv'
	processed_text = input_text.toLowerCase().replace('?',' ?')	
	/* 
	data = {'answer': ' real madrid cf', 'debugging': {'table_key': '', 'answer_feedback': [], 'is_lookup_neural': true, 'cells_answer_neural': [[1, 2]], 'is_lookup_feedback': true, 'threshold': 45.0, 'below_threshold': false, 'answer_neural': ['real madrid cf'], 'cells_answer_feedback': [], 'question': '', 'steps': [{'index': 0, 'column_name': 'player', 'rows': [1], 'column_softmax': 0.99054680061079792, 'correct': true, 'operation_softmax': 0.90454135269931735, 'column_index': 0, 'operation_index': 12, 'operation_name': 'word-match'}, {'index': 1, 'column_name': 'team', 'rows': [], 'column_softmax': 0.6281557113649795, 'correct': true, 'operation_softmax': 0.99847889357398723, 'column_index': 2, 'operation_index': 14, 'operation_name': 'print'}], 'correct': true}}
	var answer = data.answer;
	var debug = data.debugging;
	last_question = debug;
	last_question.question = input_text.toLowerCase();
	last_question.table_key = table_key;
	new_neural_programmer_answer(answer, debug);
	*/
	var timestamp = new Date().getTime();
	var question_id = "q-" + timestamp;
	$.ajax({
	  type: "POST",
	  url: url,
	  data: {"question": processed_text, "table_key": table_key, "user_id": getCookie('user_id'), "demo": "simple", "timestamp": timestamp, "question_id": question_id},
	  dataType: 'text',
	  success: function(data) {
		var data = JSON.parse(data).neural_programmer;
		console.log(data);
		data = data.replace(/True/g, true);
		data = data.replace(/False/g, false);
		data = data.replace(/'{/g, '{');
		data = data.replace(/}'/g, '}');
		data = data.replace(/"{/g, '{');
		data = data.replace(/}"/g, '}');
		data = data.replace(/'/g, '"');
		data = JSON.parse(data);
		var answer = data.answer;
		var debug = data.debugging;
		console.log("Debug:", debug);
		console.log("Answer:", answer);
		last_question = debug;
		// Update last question info
		last_question.question = input_text.toLowerCase();
		last_question.question_id = question_id;
		last_question.table_key = table_key;
		new_neural_programmer_answer(answer, debug)
	  }	
	});
}

function submit_feedback(feedback) {
	console.log("Feedback sent:", feedback);
	url = "/neural_programmer/feedback";
	feedback.user_id = getCookie('user_id');
	feedback.timestamp = new Date().getTime();
	feedback.demo = "simple";
	console.log("User:", feedback.user_id, "with timestamp:", feedback.timestamp);
	data = {"debugging": JSON.stringify(feedback)}
	$.ajax({
	  type: "POST",
	  url: url,
	  data: data,
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

function create_new_cookie(key) {
    // Expire date for cookie
    var expires = new Date();
    // Set expire date for cookie
    expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));
    var value = new Date().getTime();
    // Set cookie key and value which is passed in by parameters 
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    return value;
}

function setCookie(key) {
	var user_id =  getCookie(key);
	if (user_id == "") {
		user_id = create_new_cookie(key);
		console.log("New user:", user_id)
	}
	else console.log("Returning user:", user_id)
	return user_id;
}

function isNewUser(key) {
	var user_id =  getCookie(key);
	if (user_id == "") return true;
	else return false;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$(document).ready(function(){
	first_time = isNewUser('simple_user_id');
	first_feedback = isNewUser('first_feedback')
	console.log(first_time);
	setCookie('user_id');
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

	$("#banner").click(function(){
		window.location.replace("/neural_programmer");
	})
	$("#home_button span").click(function(){
		window.location.replace("/neural_programmer");
	})

	if (suggestions_activated) {
		$.getJSON("../static/javascripts/lists/neural_programmer_uefa.json", function(json) {
			suggestions = json.questions;
			suggestions_random = get_random_suggestions(suggestions);
		  load_suggestions(suggestions_random);
		});
	}
	/*
	if (first_time) {
		initial_tour.init();
		initial_tour.setCurrentStep(0);
    	initial_tour.start(true);
    }
    */

	table = '<div id="table-wrap""><div id="table"><table class="clean table"><thead><tr><th class="col-player">Player</th><th class="col-nationality">Nationality</th><th class="col-team">Team</th><th class="col-titles">Titles</th><th class="col-age">Age</th><th class="col-salary">Salary</th><th class="col-position">Position</th><th class="col-matches">Matches Played</th><th class="col-goals">Goals</th><th class="col-assists">Assists</th><th class="col-yellow_cards">Yellow Cards</th><th class="col-red_cards"">Red Cards</th></tr></thead><tbody><tr><td class="col-player">Iker Casillas</td><td class="col-nationality">Spain</td><td class="col-team">FC Porto</td><td class="col-titles">3</td><td class="col-age">36</td><td class="col-salary">7.500.000€</td><td class="col-position">Goalkeeper</td><td class="col-matches">164</td><td class="col-goals">0</td><td class="col-assists">0</td><td class="col-yellow_cards">5</td><td class="col-red_cards"">0</td></tr><tr><td class="col-player">Cristiano Ronaldo</td><td class="col-nationality">Portugal</td><td class="col-team">Real Madrid CF</td><td class="col-titles">4</td><td class="col-age">32</td><td class="col-salary">32.000.000€</td><td class="col-position">Forward</td><td class="col-matches">140</td><td class="col-goals">105</td><td class="col-assists">31</td><td class="col-yellow_cards">16</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Andrés Iniesta</td><td class="col-nationality">Spain</td><td class="col-team">FC Barcelona</td><td class="col-titles">4</td><td class="col-age">33</td><td class="col-salary">14.000.000€</td><td class="col-position">Midfield</td><td class="col-matches">122</td><td class="col-goals">11</td><td class="col-assists">16</td><td class="col-yellow_cards">8</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Zlatan Ibrahimovic</td><td class="col-nationality">Sweden</td><td class="col-team">Manchester United</td><td class="col-titles">0</td><td class="col-age">35</td><td class="col-salary" class="col-salary">12.000.000€</td><td class="col-position">Forward</td><td class="col-matches">119</td><td class="col-goals">48</td><td class="col-assists">22</td><td class="col-yellow_cards">19</td><td class="col-red_cards">4</td></tr><tr><td class="col-player">Leo Messi</td><td class="col-nationality">Argentina</td><td class="col-team">FC Barcelona</td><td class="col-titles">4</td><td class="col-age" class="col-age">30</td><td class="col-salary">40.000.000€</td><td class="col-position">Forward</td><td class="col-matches" class="col-matches">115</td><td class="col-goals">94</td><td class="col-assists">24</td><td class="col-yellow_cards">14</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Petr Cech</td><td class="col-nationality">Czech Republic</td><td class="col-team">FC Arsenal</td><td class="col-titles">1</td><td class="col-age">35</td><td class="col-salary">7.000.000€</td><td class="col-position">Goalkeeper</td><td class="col-matches">111</td><td class="col-goals">0</td><td class="col-assists">0</td><td class="col-yellow_cards">4</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Gianluigi Buffon</td><td class="col-nationality">Italy</td><td class="col-team">Juventus FC</td><td class="col-titles">0</td><td class="col-age">39</td><td class="col-salary">4.000.000€</td><td class="col-position">Goalkeeper</td><td class="col-matches">108</td><td class="col-goals">0</td><td class="col-assists">0</td><td class="col-yellow_cards">2</td><td class="col-red_cards">0</td></tr><tr><td class="col-player">Sergio Ramos</td><td class="col-nationality">Spain</td><td class="col-team">Real Madrid CF</td><td class="col-titles">3</td><td class="col-age">31</td><td class="col-salary">10.000.000€</td><td class="col-position">Defender</td><td class="col-matches">103</td><td class="col-goals">10</td><td class="col-assists">6</td><td class="col-yellow_cards">32</td><td class="col-red_cards">3</td></tr></tbody></table></div></div>'
	//table = '<div id="table-wrap" style="height: 664px;"><div id="table"><table class="clean table"><thead><tr><th>S.No.</th><th>Name of Kingdom</th><th>Name of King</th><th>No. of villages</th><th>Capital</th><th>Names of districts</th></tr></thead><tbody><tr><td>1.</td><td>Sihag</td><td>Chokha Singh</td><td>150</td><td>Suin</td><td>Rawatsar, Baramsar, Purabsar Dandusar, Gandaisi</td></tr><tr><td>2.</td><td>Beniwal</td><td>Raisal Singh</td><td>150</td><td>Rasalana</td><td>Bhukarka, Sanduri, Manoharpur, Kooi, Bae</td></tr><tr><td>3.</td><td>Johiya</td><td>Sher Singh</td><td>600</td><td>Bhurupal</td><td>Jaitpur, Kumanu, Mahajan, Peepasar, Udasar</td></tr><tr><td>4.</td><td>Punia</td><td>Kanha Singh</td><td>300</td><td>Luddi</td><td>Bhadra, Ajitpura, Sidhmukh, Rajgarh, Dadrewa, Sankhoo</td></tr><tr><td>5.</td><td>Saharan</td><td>Pula Singh</td><td>300</td><td>Bhadang</td><td>Khejra, Phoglo, Buchawas, Sui, Badnu, Sirsila</td></tr><tr><td>6.</td><td>Godara</td><td>Pandu Singh</td><td>700</td><td>Shekhsar</td><td>Shekhsar, Pundrasar, Gusainsar (Bada), Gharsisar, Garibdesar, Rungaysar, Kalu</td></tr><tr><td>7.</td><td>Kaswan</td><td>Kanwarpal Singh</td><td>400</td><td>Sidhmukh</td><td></td></tr></tbody></table></div>    </div>'
	//table = '<div id="table-wrap""><div id="table"><table class="clean table"><thead><tr><th>Package</th><th>Broadband speed (Mbps)</th><th>International time (Minutes)</th><th>Roaming (Days)</th><th>Price (CHF)</th><th>Description</th></tr></thead><tbody><tr><td>InOne XL</td><td>200</td><td>1000</td><td>365</td><td>180</td><td>With highspeed internet, ideal for business</td></tr><tr><td>InOne L</td><td>200</td><td>300</td><td>365</td><td>120</td><td>Complete package thought for Erasmus students.</td></tr><tr><td>InOne M</td><td>200</td><td>100</td><td>60</td><td>90</td><td>Top seller package, ideal for teenagers to use the social media.</td></tr><tr><td>InOne S</td><td>20</td><td>60</td><td>45</td><td>70</td><td>Fast internet with an affordable price. Convenient for holidays abroad.</td></tr><tr><td>InOne XS</td><td>2</td><td>30</td><td>30</td><td>50</td><td>Package cheap, simple and easy.</td><tr></tbody></table></div></div>'
	$('#table_container').html(table)
});
