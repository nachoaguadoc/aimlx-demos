
function start_spinner() {
    $('#original_text').append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
    $('#summarized_text').append('<i class="fa fa-spinner fa-spin" id="spinner"></i>');
}

function answer(text, summary) {
    contents = text.replace(/\n/g,'<br>')
    summary = summary.replace(/\n/g,'<br>')
    $('#original_text').html(contents);
    $('#summarized_text').html(summary);
    stop_spinner();
}


function submit(input_text) {
    // $('#input_text').val('');
    start_spinner();
    url = "/summary_url"
    $.ajax({
      type: "POST",
      url: url,
      data: {'inp_url':input_text,'model_type':model_type},
      dataType: 'text',
      success: function(data) {
        data = JSON.parse(data);
        var text = data.text;
        var summary = data.summary;
        console.log('>>>')
        console.log(text)
        console.log('>>>>')
        console.log(summary)
        answer(text, summary)
      }
    });
}


function clean() {
    $('#question').text('');
    $('#original_text').text('');
    $('#summarized_text').text('');
}

$(document).ready(function(){
    model_type = 'extractive'
    $('#input_text').keyup(function(e){
        if(e.keyCode == 13) {
            input_text = $('#input_text').val();
            if (input_text != '') submit(input_text, $('#project_value').text());
        }
    });

    $('#search_button').click(function(e){
        input_text = $('#input_text').val();
        if (input_text != '') submit(input_text, $('#project_value').text());
    })

    $('#refresh_button').click(function(e){
        document.getElementById('input_text').value="";
        $('#original_text').html("");
        $('#summarized_text').html("");
    })

    $('input:radio[name="model_type"]').change( function(){
        if ($(this).is(':checked') && $(this).val() == 'extractive') {
            model_type='extractive'
        } else if ($(this).is(':checked') && $(this).val() == 'mixed'){
            model_type='mixed'
        }else {
            model_type='abstractive'
        }
        input_text = $('#input_text').val();
        if (input_text != '') submit(input_text, $('#project_value').text());        
    });

});

