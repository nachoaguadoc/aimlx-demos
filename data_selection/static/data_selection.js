/* -------------  Audio player  ------------- */

// Audio Samples
const audioSamples = [
  "1737-146161-0013.wav",
  "839-130898-0001.wav",
  "1737-146161-0007.wav",
  "27-124992-0036.wav",
  "26-495-0017.wav",
  "6531-61334-0009.wav"
];

// Audio Samples
const uttId = [
  "1737-146161-0013",
  "839-130898-0001",
  "1737-146161-0007",
  "27-124992-0036",
  "26-495-0017",
  "6531-61334-0009"
];

// Audio Instance
var wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#ADADAD",
  scrollParent: true,
  progressColor: "#0851DA",
  barHeight: 2,
  height: 41,
  width: 100,
  hideScrollbar: true,
  audioRate: 1
});

// Load the audio sample
var loadAudioSample = function(id) {
  $("#stop-btn").addClass("display-none");
  $("#play-btn").removeClass("display-none");

  audioSample = audioSamples[id];
  let audioPathFile = "data_selection/static/asset/" + audioSample;
  wavesurfer.load(audioPathFile);
  showCurrentRate();

  let audioDuration = showAudioDuration();
  document.getElementById("duration-time").innerHTML = audioDuration;

  let currentTime = showCurrentTime();
  document.getElementById("current-time").innerHTML = currentTime;
};

/* ---------- Audio options ---------- */

// Play/Pause
$(".btn-container").on("click", function() {
  wavesurfer.playPause();

  if ($("#play-btn").hasClass("display-none")) {
    $("#play-btn").removeClass("display-none");
  } else {
    $("#play-btn").addClass("display-none");
  }
  if ($("#stop-btn").hasClass("display-none")) {
    $("#stop-btn").removeClass("display-none");
  } else {
    $("#stop-btn").addClass("display-none");
  }
});

//Audio current time
wavesurfer.on("play", function() {
  setInterval(function() {
    var currentTime = showCurrentTime();
    document.getElementById("current-time").innerHTML = currentTime;
  }, 100);
});

// Reset audio at the start
wavesurfer.on("finish", function() {
  $("#stop-btn").addClass("display-none");
  $("#play-btn").removeClass("display-none");
  wavesurfer.stop();
});

// Set the audio speed rate
$(".rate-option").on("click", function() {
  let index = wavesurfer.getPlaybackRate();
  const rates = [0.8, 1, 1.2];
  if (this.id === "plus") {
    wavesurfer.setPlaybackRate(rates[index + 1]);
  } else if (this.id === "minus") {
    wavesurfer.setPlaybackRate(rates[index - 1]);
  }
  let currentRate = wavesurfer.getPlaybackRate();
  $("#audio-speed-rate").text(currentRate + "x");
});

// Navigation for the samples
$(".sample-label span").on("click", function() {
  let id = this.id;
  loadAudioSample(this.id);
  $(".sample-label span").removeClass("active");
  $("#" + id).addClass("active");

  // Hide the result panel when the user click on another audio sample
  $("#results-section").addClass("display-none");
});

// Restart the audio sample (return to the start)
$("#go-start").on("click", function() {
  wavesurfer.stop();
  $("#stop-btn").addClass("display-none");
  $("#play-btn").removeClass("display-none");
});

// Finish the audio sample
$("#go-end").on("click", function() {
  wavesurfer.skipForward(10);
  $("#stop-btn").addClass("display-none");
  $("#play-btn").removeClass("display-none");
});

let input = "";

$("#input-transcription")
  .keypress(function(e) {
    if (e.which === 13) {
      isLoading();
      submit(input);
      clearResults();
      $("#results-section").addClass("display-none");
      return false;
    }
  })
  .on("input", function() {
    input = this.value;
    checkCompletion();
  });

$("#submit-button").on("click", function() {
  isLoading();
  submit(input);
  clearResults();
  $("#results-section").addClass("display-none");
});

function submit(input) {
  let currentSampleId = $(".active").attr("id");
  var url =
    "http://52.30.254.33:6121/api/compute/sim/" + uttId[currentSampleId];
  var data = { input: input };

  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function(data) {
      let jsonPhonSim = data["ng"];
      let jsonLexiSim = data["tp"];

      let phoneticalSimilarities = buildResultStructure(jsonPhonSim);
      let lexicalSimilarities = buildResultStructure(jsonLexiSim);

      $("#user-transcription").append(
        '<div class="user-transcription">User transcription:</div>' + input
      );
      $("#input-transcription")
        .prop("disabled", false)
        .val("");

      $("#loader").addClass("display-none");
      $("#submit-button span").show();

      input = "";
      checkCompletion();

      $("#phon-root").append(phoneticalSimilarities);
      $("#lex-root").append(lexicalSimilarities);
      $("#results-section").removeClass("display-none");
    }
  });
}

$(document).ready(function() {
  $("#audio-speed-rate").text(wavesurfer.audioRate);
  loadAudioSample(0);
});

// Functions definition
const minInputLength = 9;

function showAudioDuration() {
  let audioDuration = wavesurfer.getDuration();
  var minutes = "0" + Math.floor(audioDuration / 60);
  var seconds = "0" + Math.floor(audioDuration - minutes * 60);
  var formattedDuration = minutes.substr(-1) + ":" + seconds.substr(-2);
  return formattedDuration;
}

function showCurrentTime() {
  var time = wavesurfer.getCurrentTime();
  var minutes = "0" + Math.floor(time / 60);
  var seconds = "0" + Math.floor(time - minutes * 60);
  var CurrentTime = minutes.substr(-1) + ":" + seconds.substr(-2);
  return CurrentTime;
}

function showCurrentRate() {
  let audioRate = wavesurfer.getPlaybackRate();
  $("#audio-speed-rate").text(audioRate + "x");
}

function checkCompletion() {
  if (input.length > minInputLength) {
    $("#submit-button").removeClass("disabled");
  } else {
    $("#submit-button").addClass("disabled");
  }
}

function isLoading() {
  $("#input-transcription").prop("disabled", true);
  $("#submit-button span").hide();
  $("#loader").removeClass("display-none");
}

function clearResults() {
  input = "";
  $("#phon-root").empty();
  $("#lex-root").empty();
  $("#user-transcription").empty();
}

function buildResultStructure(json) {
  let result = json.map(json => {
    let score;
    if ("ngrams_sim" in json) {
      score = json.ngrams_sim;
    } else {
      score = json.triphone_sim;
    }
    return (
      '<tr><td class="transcription" title="' +
      json.transcript +
      '">' +
      json.transcript +
      '</td><td class="score">' +
      Math.round(score * 1000) / 10 +
      " %</td></tr>"
    );
  });
  return result;
}
