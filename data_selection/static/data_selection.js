/* -------------  Audio player  ------------- */

// Audio Samples
const audioSamples = [
  '26-495-0017.wav',
  '8014-112586-0013.wav',
  '27-124992-0036.wav',
  '6531-61334-0009.wav',
  '1737-146161-0007.wav',
  '1737-146161-0009.wav'
];

// Audio Instance
var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#ADADAD',
  scrollParent: true,
  progressColor: '#0851DA',
  barHeight: 2,
  height: 41,
  width: 100,
  hideScrollbar: true,
  audioRate: 1
});

// Load the audio sample
var loadAudioSample = function(id) {

  $('#stop-btn').addClass('display-none');
  $('#play-btn').removeClass('display-none');

  audioSample = audioSamples[id];
  let audioPathFile = 'data_selection/static/asset/' + audioSample;
  wavesurfer.load(audioPathFile);
  showCurrentRate();

  let audioDuration = showAudioDuration();
  document.getElementById('duration-time').innerHTML = audioDuration;

  let currentTime = showCurrentTime();
  document.getElementById('current-time').innerHTML = currentTime;
}

/* ---------- Audio options ---------- */

// Play/Pause
$('.btn-container').on('click', function () {
  wavesurfer.playPause();

  if($('#play-btn').hasClass('display-none')){
    $('#play-btn').removeClass('display-none');
  }else{
    $('#play-btn').addClass('display-none');
  }
  if($('#stop-btn').hasClass('display-none')){
    $('#stop-btn').removeClass('display-none');
  }else{
    $('#stop-btn').addClass('display-none');
  }
});

//Audio current time
wavesurfer.on('play', function () {
    setInterval(function(){ 
      var currentTime = showCurrentTime();
      document.getElementById('current-time').innerHTML = currentTime;
    }, 100)
});

// Reset audio at the start
wavesurfer.on('finish', function () {
  $('#stop-btn').addClass('display-none');
  $('#play-btn').removeClass('display-none');
  wavesurfer.stop();
});

// Set the audio speed rate
$('.rate-option').on('click', function(){
    let index = wavesurfer.getPlaybackRate();
    const rates = [0.8, 1, 1.2];
    if(this.id === 'plus'){
      wavesurfer.setPlaybackRate(rates[index + 1]);
    }else if(this.id === 'minus'){
      wavesurfer.setPlaybackRate(rates[index - 1]);
    }
    let currentRate = wavesurfer.getPlaybackRate();
    console.log(currentRate);
    $('#audio-speed-rate').text(currentRate + 'x');
});

// Navigation for the samples 
$('.sample-label span').on('click', function() {
  let id = this.id;
  loadAudioSample(this.id);
  $('.sample-label span').removeClass('active');
  $('#' + id).addClass('active');
});

$('#go-start').on('click', function(){
  wavesurfer.stop();
  $('#stop-btn').addClass('display-none');
  $('#play-btn').removeClass('display-none');
});

$('#go-end').on('click', function(){
  wavesurfer.skipForward(10);
  $('#stop-btn').addClass('display-none');
  $('#play-btn').removeClass('display-none');
});


// Functions definition
function showAudioDuration(){
  let audioDuration = wavesurfer.getDuration();
  var minutes = "0" + Math.floor(audioDuration / 60);
  var seconds = "0" + Math.floor(audioDuration - minutes * 60);
  var formattedDuration = minutes.substr(-1) + ":" + seconds.substr(-2);
  return formattedDuration;
}

function showCurrentTime(){
  var time = wavesurfer.getCurrentTime();
  var minutes = "0" + Math.floor(time / 60);
  var seconds = "0" + Math.floor(time - minutes * 60);
  var CurrentTime = minutes.substr(-1) + ":" + seconds.substr(-2);
  return CurrentTime;
}

function showCurrentRate() {
  let audioRate = wavesurfer.getPlaybackRate();
  $('#audio-speed-rate').text(audioRate + 'x');  
}

let dataInput = '';

$('#input-transcription').on('input', function () {
  dataInput = this.value;
  console.log(dataInput.length);
  checkCompletion();
});

const minInputLength = 9;

function checkCompletion(){
  if (dataInput.length > minInputLength) {
     $('#submit-button').removeClass('disabled');
 } else {
     $('#submit-button').addClass('disabled');
 }
}

function submit(input) {

  var url = "";

  var data = dataInput;
  $.ajax({
      type: "POST",
      url: url,
      contentType: 'application/json',
      data: JSON.stringify(data, null, '\t'),
      success: function (data) {
          phonetical = data[''];
          lexical = data[''];
          dataInput='';
      }
  });
}

$( document ).ready(function() {
  $('#audio-speed-rate').text(wavesurfer.audioRate);
  loadAudioSample(0);
});