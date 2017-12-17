
function new_question(question) {
  $('#question').text(question);
  start_spinner();
  $("#answer").css('visibility', 'hidden');
  $('#answer').text('');
  $("#question").css('visibility', 'visible');
}

function seq2sql_answer(answer) {
  //$('#answer_np').text(np);
  $("#answer").css('visibility', 'visible');
  $("#answer").html(answer)

  stop_spinner();

}

function submit(input_text) {
  console.log("Seq2SQL input:", input_text)
  $('#input_text').val('');
  new_question(input_text);
  url = "/seq2sql"

  processed_text = input_text.replace('?',' ?') 
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
  var data = {"question": processed_text}
  $.ajax({
    type: "POST",
    url: url,
    contentType: 'application/json',
    data: JSON.stringify(data, null, '\t'),
    success: function(data) {
      console.log(data)
      seq2sql_answer(data['seq2sql'])
    } 
  });
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

  $("#banner").click(function(){
    window.location.replace("/");
  })
  $("#home_button span").click(function(){
    window.location.replace("/");
  })

table = '<div id="table-wrap""><div id="table"><table class="clean table"><thead><tr><th class="col-player">Pick #</th><th class="col-nationality">NFL Team</th><th class="col-team">Player</th><th class="col-titles">Position</th><th class="col-age">College</th></tr></thead><tbody><tr><td class="col-player">5</td><td class="col-nationality">Green Bay Packers</td><td class="col-team">Terrell Buckley</td><td class="col-titles">Cornerback</td><td class="col-age">Florida State</td></tr><tr><td class="col-player">188</td><td class="col-nationality">Cleveland Browns</td><td class="col-team">Thane Gash</td><td class="col-titles">Defensive Back</td><td class="col-age">East Tennessee State</td></tr><tr><td class="col-player">280</td><td class="col-nationality">Baltimore Colts</td><td class="col-team">Jim Bob Taylor</td><td class="col-titles">Quarterback</td><td class="col-age">Georgia Tech</td></tr><tr><td class="col-player">281</td><td class="col-nationality">New York Giants</td><td class="col-team">Lee Jenkins</td><td class="col-titles">Defensive back</td><td class="col-age">Tennessee</td></tr><tr><td class="col-player">282</td><td class="col-nationality">Los Angeles Rams</td><td class="col-team">Danny Triplett</td><td class="col-titles">Linebacker</td><td class="col-age">Clemson</td></tr><tr><td class="col-player">283</td><td class="col-nationality">Denver Broncos</td><td class="col-team">Don Bailey</td><td class="col-titles">Center</td><td class="col-age">Miami (FL)</td></tr><tr><td class="col-player">284</td><td class="col-nationality">Kansas City Chiefs</td><td class="col-team">Dwayne Jackson</td><td class="col-titles">Defensive end</td><td class="col-age">South Carolina State</td></tr><tr><td class="col-player">285</td><td class="col-nationality">Philadelphia Eagles</td><td class="col-team">Steve Sebahar</td><td class="col-titles">Center</td><td class="col-age">Washington State</td></tr><tr><td class="col-player">286</td><td class="col-nationality">Chicago Bears</td><td class="col-team">Gary Worthy</td><td class="col-titles">Running back</td><td class="col-age">Wilmington (OH)</td></tr><tr><td class="col-player">287</td><td class="col-nationality">Detroit Lions</td><td class="col-team">Ben Tate</td><td class="col-titles">Running back</td><td class="col-age">North Carolina Central</td></tr><tr><td class="col-player">288</td><td class="col-nationality">Cleveland Browns</td><td class="col-team">Boyce Green</td><td class="col-titles">Running back</td><td class="col-age">Carson-Newman</td></tr><tr><td class="col-player">289</td><td class="col-nationality">San Francisco 49ers</td><td class="col-team">Jesse Sapolu</td><td class="col-titles">Center</td><td class="col-age">Hawaii</td></tr><tr><td class="col-player">290</td><td class="col-nationality">Seattle Seahawks</td><td class="col-team">Bob Mayberry</td><td class="col-titles">Guard</td><td class="col-age">Clemson</td></tr><tr><td class="col-player">291</td><td class="col-nationality">New York Giants</td><td class="col-team">Clenzie Pierson</td><td class="col-titles">Defensive tackle</td><td class="col-age">Rice</td></tr></tbody></table></div></div>'  //table = '<div id="table-wrap" style="height: 664px;"><div id="table"><table class="clean table"><thead><tr><th>S.No.</th><th>Name of Kingdom</th><th>Name of King</th><th>No. of villages</th><th>Capital</th><th>Names of districts</th></tr></thead><tbody><tr><td>1.</td><td>Sihag</td><td>Chokha Singh</td><td>150</td><td>Suin</td><td>Rawatsar, Baramsar, Purabsar Dandusar, Gandaisi</td></tr><tr><td>2.</td><td>Beniwal</td><td>Raisal Singh</td><td>150</td><td>Rasalana</td><td>Bhukarka, Sanduri, Manoharpur, Kooi, Bae</td></tr><tr><td>3.</td><td>Johiya</td><td>Sher Singh</td><td>600</td><td>Bhurupal</td><td>Jaitpur, Kumanu, Mahajan, Peepasar, Udasar</td></tr><tr><td>4.</td><td>Punia</td><td>Kanha Singh</td><td>300</td><td>Luddi</td><td>Bhadra, Ajitpura, Sidhmukh, Rajgarh, Dadrewa, Sankhoo</td></tr><tr><td>5.</td><td>Saharan</td><td>Pula Singh</td><td>300</td><td>Bhadang</td><td>Khejra, Phoglo, Buchawas, Sui, Badnu, Sirsila</td></tr><tr><td>6.</td><td>Godara</td><td>Pandu Singh</td><td>700</td><td>Shekhsar</td><td>Shekhsar, Pundrasar, Gusainsar (Bada), Gharsisar, Garibdesar, Rungaysar, Kalu</td></tr><tr><td>7.</td><td>Kaswan</td><td>Kanwarpal Singh</td><td>400</td><td>Sidhmukh</td><td></td></tr></tbody></table></div>    </div>'
  //table = '<div id="table-wrap""><div id="table"><table class="clean table"><thead><tr><th>Package</th><th>Broadband speed (Mbps)</th><th>International time (Minutes)</th><th>Roaming (Days)</th><th>Price (CHF)</th><th>Description</th></tr></thead><tbody><tr><td>InOne XL</td><td>200</td><td>1000</td><td>365</td><td>180</td><td>With highspeed internet, ideal for business</td></tr><tr><td>InOne L</td><td>200</td><td>300</td><td>365</td><td>120</td><td>Complete package thought for Erasmus students.</td></tr><tr><td>InOne M</td><td>200</td><td>100</td><td>60</td><td>90</td><td>Top seller package, ideal for teenagers to use the social media.</td></tr><tr><td>InOne S</td><td>20</td><td>60</td><td>45</td><td>70</td><td>Fast internet with an affordable price. Convenient for holidays abroad.</td></tr><tr><td>InOne XS</td><td>2</td><td>30</td><td>30</td><td>50</td><td>Package cheap, simple and easy.</td><tr></tbody></table></div></div>'
  $('#table_container').html(table)
});
