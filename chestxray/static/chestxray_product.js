var static_img = ["00003064_035", "00009669_003","00014706_007","00014626_028","00010381_000","00000506_013", "00012141_013"];
var img_path = '/static/assets/chestxray_images/';

function new_message(message) {
    $('#upload_row').hide();
    $('#back_button').hide();
	$('#message_row').show();
	$('#spinner').show();
	$('#message').text(message);


}

function show_output(list){
    $('#upload_row').hide();
    $('#spinner').hide();
    $('#back_button').show();
    $('#message').text('Localization heatmap');
    $('#suggestions_row1').hide();
    $('#suggestions_row3').hide();
    $('#suggestions_row2').hide();
    $('#result_row1').show();
    $('#result_row2').show();


    $('#result_img0').attr('src',img_path.concat(list[0]));
    $('#result_img1').attr('src',img_path.concat(list[1]));
    $('#result_img2').attr('src',img_path.concat(list[2]));
    $('#result_img3').attr('src',img_path.concat(list[3]));

}


function submit(input_text,id) {


    id = static_img[parseInt(id)-1]
	new_message(input_text);
	url = "/chestxray/static";
    var data = {"image_list": id+'.png'};

	$.ajax({
	  type: "POST",
	  url: url,
	  contentType: 'application/json',
	  data: JSON.stringify(data),
	  success: function(data) {
        json = JSON.parse(data);
        console.log(json.list);
        show_output(json.list);

	  }
	});
}


function refresh() {
    $('#back_button').hide();
	$('#message_row').hide();
	$('#upload_row').show();
	$('#suggestions_row1').show();
    $('#suggestions_row3').show();
    $('#suggestions_row2').hide();
    $('#result_row1').hide();
    $('#result_row2').hide();
}

function upload(formData){
    new_message('Uploading and Processing Image... Get a coffee :P');

$.ajax({
       url: "/chestxray/upload",
       type: "POST",
       data: formData,
       processData: false,
       contentType: false,
       success: function(data) {
            json = JSON.parse(data);
            console.log(json.list);
            show_output(json.list);
       },
       error: function(jqXHR, textStatus, errorMessage) {
           console.log(errorMessage); // Optional
       }
    });
}
$(document).ready(function(){


	$('#message_row').hide();
	$('#suggestions_row2').hide();


    img_sug = '#img_sug';
    for (var i = 1; i <= 6; i++) {
        var elem = img_sug.concat(i.toString());
        $(elem).attr('src', img_path.concat(static_img[i-1],'.png'));
        $(elem).click(function(e){
            console.log("Image clicked!!");
            var name = e.target.id;
            submit('Processing Image.. Take a breath',name.charAt(name.length-1));
        });
    }

    $('#upload_button').click(function(e){
        var input = document.getElementById('input_file')
        var formData = new FormData();
        console.log(input.files.length)
        if(input.files.length > 0 ){
            formData.append("fileToUpload", input.files[0]);
            upload(formData);
        }
    });
	
	$("#back_button").click(function(){
		refresh();
	})

});

