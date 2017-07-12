answers_translate = {"word-match": " and perform a <b>word query</b>.", "print": " and <b>return</b> the results.", "count": " and return the <b>number</b> of results.", "group_by_max": " and <b>group</b> the elements by the query.", "max": " and obtain the <b>maximum</b> value.", "min": " and obtain the <b>minimum</b> value.", "greater": " and get the cells with value <b>greater</b> than the query.", "smaller": " and get the cells with value <b>smaller</b> than the query.", "geq": " and get the cells with value <b>greater or equal</b> than the query.", "leq": " and get the cells with value <b>smaller or equal</b> than the query.", "first_rs": " and get the <b>first</b> cell.", "last_rs": " and get the <b>last</b> cell.", "reset_select": " and <b>select all</b> the rows."}
var suggestions_activated = false;


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
	$("#answer_np").css('visibility', 'visible');
	var steps = "";
	var last_rows = ""
	for (var i=0, l=debug.steps.length; i<l; i++) { 
		step = debug.steps[i]
		op = step.operation_name;
		col = step.column_name;
		rows = step.rows;
		index = i+1;
		if (i == l -1) {
			var rows_selector = last_rows;
		}
		else {
			var rows_selector = rows.join('-');
			last_rows = rows_selector;
		}
		steps += "<div class='col-md-4'><div id='step_" + i +  "' class='panel panel-default step col-md-10 steps_box'><div class='panel-heading'><h3 class='panel-title'>Step " + index +  "</h3></div><div class='panel-body'><span>Select the column <b><span rows=" + rows_selector + " class='col'>" + col + "</span></b>" + answers_translate[op] + "</span></div></div><span class='glyphicon glyphicon-arrow-right hidden right-arrow col-md-2'></div>"
	}

	steps += "<div class='col-md-4'><div id='answer' class='panel panel-primary answer_box step'><div class='panel-heading'><h3 class='panel-title'>Answer</h3></div><div id='to_replace' class='panel-body'><span>" + np + "</span></div></div></div>"
	$('#debug').html(steps);
	$("#debug").css('visibility', 'visible');

	setTimeout(function(){
	    $('#step_0').fadeIn(1500);
	    setTimeout(function(){
		    $('#step_1').fadeIn(1500)
		}, 500);
	}, 500);
	if (suggestions_activated) {
		suggestions_random = get_random_suggestions(suggestions);
	    load_suggestions(suggestions_random);
	}
	stop_spinner();

}


function submit(input_text) {
	console.log("Neural Programmer input:", input_text)
	$('#input_text').val('');
	new_question(input_text);
	url = "/neural_programmer/demo_question"
	//table_key = 'csv/203-csv/713.csv'
	
	table_key = 'csv/custom-csv/swisscom.csv'
	processed_text = input_text.toLowerCase().replace('?',' ?')	

	$.ajax({
	  type: "POST",
	  url: url,
	  data: {"question": processed_text, "table_key": table_key},
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

		new_neural_programmer_answer(answer, debug)
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
	if (suggestions_activated) {
		$.getJSON("../static/javascripts/lists/neural_programmer_uefa.json", function(json) {
			suggestions = json.questions;
			suggestions_random = get_random_suggestions(suggestions);
		  load_suggestions(suggestions_random);
		});
	}
	
	$(document).on('mouseenter', '.steps_box', function() {
    	var col = $(this).find('.col')[0]
		var col_name = $(col).text().replace(/ /g, "_");
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
		col_name = ".col-" + col_name
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

	table = '<div id="table-wrap""><div id="table"><table class="clean table"><thead><tr><th class="col-package">Package</th><th class="col-download_speed">Download speed (Mbps)</th><th class="col-international_calls">International time (Minutes)</th><th class="col-roaming">Roaming (Days)</th><th class="col-price">Price (CHF)</th><th class="col-description">Description</th></tr></thead><tbody><tr><td class="col-package">InOne XL</td><td class="col-download_speed">200</td><td class="col-international_calls">1000</td><td class="col-roaming">365</td><td class="col-price">180</td><td class="col-description">With highspeed internet, ideal for business</td></tr><tr><td class="col-package">InOne L</td><td class="col-download_speed">200</td><td class="col-international_calls">300</td><td class="col-roaming">365</td><td class="col-price">120</td><td class="col-description">Complete package thought for Erasmus students.</td></tr><tr><td class="col-package">InOne M</td><td class="col-download_speed">200</td><td class="col-international_calls">100</td><td class="col-roaming">60</td><td class="col-price">90</td><td class="col-description">Top seller package, ideal for teenagers to use the social media.</td></tr><tr><td class="col-package">InOne S</td><td class="col-download_speed">20</td><td class="col-international_calls">60</td><td class="col-roaming">45</td><td class="col-price">70</td><td class="col-description">Fast internet with an affordable price. Convenient for holidays abroad.</td></tr><tr><td class="col-package">InOne XS</td><td class="col-download_speed">2</td><td class="col-international_calls">30</td><td class="col-roaming">30</td><td class="col-price">50</td><td class="col-description">Package cheap, simple and easy.</td><tr></tbody></table></div></div>'
	//table = '<div id="table-wrap" style="height: 664px;"><div id="table"><table class="clean table"><thead><tr><th>S.No.</th><th>Name of Kingdom</th><th>Name of King</th><th>No. of villages</th><th>Capital</th><th>Names of districts</th></tr></thead><tbody><tr><td>1.</td><td>Sihag</td><td>Chokha Singh</td><td>150</td><td>Suin</td><td>Rawatsar, Baramsar, Purabsar Dandusar, Gandaisi</td></tr><tr><td>2.</td><td>Beniwal</td><td>Raisal Singh</td><td>150</td><td>Rasalana</td><td>Bhukarka, Sanduri, Manoharpur, Kooi, Bae</td></tr><tr><td>3.</td><td>Johiya</td><td>Sher Singh</td><td>600</td><td>Bhurupal</td><td>Jaitpur, Kumanu, Mahajan, Peepasar, Udasar</td></tr><tr><td>4.</td><td>Punia</td><td>Kanha Singh</td><td>300</td><td>Luddi</td><td>Bhadra, Ajitpura, Sidhmukh, Rajgarh, Dadrewa, Sankhoo</td></tr><tr><td>5.</td><td>Saharan</td><td>Pula Singh</td><td>300</td><td>Bhadang</td><td>Khejra, Phoglo, Buchawas, Sui, Badnu, Sirsila</td></tr><tr><td>6.</td><td>Godara</td><td>Pandu Singh</td><td>700</td><td>Shekhsar</td><td>Shekhsar, Pundrasar, Gusainsar (Bada), Gharsisar, Garibdesar, Rungaysar, Kalu</td></tr><tr><td>7.</td><td>Kaswan</td><td>Kanwarpal Singh</td><td>400</td><td>Sidhmukh</td><td></td></tr></tbody></table></div>    </div>'
	//table = '<div id="table-wrap""><div id="table"><table class="clean table"><thead><tr><th>Package</th><th>Broadband speed (Mbps)</th><th>International time (Minutes)</th><th>Roaming (Days)</th><th>Price (CHF)</th><th>Description</th></tr></thead><tbody><tr><td>InOne XL</td><td>200</td><td>1000</td><td>365</td><td>180</td><td>With highspeed internet, ideal for business</td></tr><tr><td>InOne L</td><td>200</td><td>300</td><td>365</td><td>120</td><td>Complete package thought for Erasmus students.</td></tr><tr><td>InOne M</td><td>200</td><td>100</td><td>60</td><td>90</td><td>Top seller package, ideal for teenagers to use the social media.</td></tr><tr><td>InOne S</td><td>20</td><td>60</td><td>45</td><td>70</td><td>Fast internet with an affordable price. Convenient for holidays abroad.</td></tr><tr><td>InOne XS</td><td>2</td><td>30</td><td>30</td><td>50</td><td>Package cheap, simple and easy.</td><tr></tbody></table></div></div>'
	$('#table_container').html(table)
});
