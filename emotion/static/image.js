// Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}

// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
	document.getElementById('processed_img').src = '';
	$('#canvas').show();
    context.drawImage(video, 0, 0, 500, 375);

    var dataURL = canvas.toDataURL("image/png");
    dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/,"");
	var data = {"image": dataURL};
	url = "/emotion"
	$.ajax({
	  type: "POST",
	  url: url,
	  contentType: 'application/json',
	  data: JSON.stringify(data, null, '\t'),
	  success: function(data) {
	  	$('#canvas').hide()
	  	var path = 'static/assets/images/' + data['image_path']
	  	console.log('=================')
	  	console.log(data['image_path'])
	  	console.log('=================')
	  	//var path = '/Users/kyritsis/Desktop/aimlx-demos/emotion/static/images/' + data['image_path']
	  	document.getElementById('processed_img').src = path
        console.log("Image uploaded:", path);
	  }
	});
});

