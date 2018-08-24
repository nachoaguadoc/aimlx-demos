function submit(input_text, number_keyphrases) {
	$("#last_group").append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
	$('#input_text').val('');
	url = "http://52.30.254.33:1277/api/kp";
	data = {'inp_url' : input_text,
	  'nbkp' : number_keyphrases
	  };
$.ajax({
  url: "http://52.30.254.33:1277/api/kp",
  type: "POST",
  contentType: 'application/json',
  dataType :"json",
  data: JSON.stringify(data),
  success: function(data) {
        //Process the JSON
        console.log(data);
        $("#spinner").remove();
        var Itemlist = document.getElementById("list-group");

        //Loop trough the JSON
        data.api_result.forEach(function(element) {
        element.relevance *=100;
        var getProcent= element.relevance ;
        Itemlist.insertAdjacentHTML( 'beforeend',"<li data-time='"+getProcent+"' class='list-group-item' style='background : linear-gradient(90deg, #90EE90 "+getProcent+"%, #FFFFFF 0%); text-shadow: none'>"+ "  " +element.label + " </li>"); 
        if(element.aliases.length > 0){
            //console.log(element.aliases.length);
            for(var i = 0; i < element.aliases.length; i++){
              //This is only for testcases until I found a solution
              getProcent -=0.000001;
              //
            Itemlist.insertAdjacentHTML( 'beforeend',"<li data-time='"+getProcent+"' class='list-group-item'>"+element.aliases[i]+"</li>");
              //console.log(element.aliases);
            }
        };
    });

  var textlist = document.getElementById("html_doc");
  var processed_text = data.processed_text;
  processed_text = processed_text.replace(/(\r\n\t|\n|\r\t)/gm, '</div><div class=start></br>');
  textlist.insertAdjacentHTML('beforeend',"<div class='start'>"+processed_text); 
  textlist.innerHTML = textlist.innerHTML.replace(/<phrase>/g, '<span class=kp>') .replace(/<\/phrase>/g, '</span>');

  //Sort <li> elements
  var listitems = $('.list-group-item');
  listitems.sort(function(a, b){
  return +$(b).data('time') - +$(a).data('time');
  }); 
  listitems.appendTo('#list-group');
},
error : function(jqXHR, textStatus, errorThrown) {
},

timeout: 120000,
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




