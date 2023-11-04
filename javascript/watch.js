//STOPWATCH

var sec = 0, min = 0, hr = 0;
var timer;
var run = false;

function displayTime() {
  sec++;
  if (sec >= 60) {
    sec = 0; min++;
    if (min >= 60) {
      min = 0; hr++;
    }
  }

  var s = sec > 9 ? sec : "0" + sec;
	var m = min ? min > 9 ? min : "0" + min : "00";
	var h = hr ? hr > 9 ? hr : "0" + hr : "00";
  document.getElementById('timer').innerHTML = h+":"+m+":"+s;
}

function runTimer() {
  displayTime();
  timer = setTimeout(runTimer,1000);
  if (isCameraRun) {
    checkFaceEye();
    checkState();
  }
}

function startTimer() {
  if (run) return;
  run = true
  document.getElementById('timer').style.color = "black";
  snoozeStack = 0; leftseatStack = 0;
  setTimeout(runTimer,1000);
}

function stopTimer() {
  run = false;
  document.getElementById('timer').style.color = "grey";
  clearTimeout(timer);
}

function resetTimer() {
  document.getElementById('timer').innerHTML = "00:00:00";
  sec = min = hr = 0;
  stopTimer();
}


//VIDEO

var width = 320, height = 240;
var streaming = false;
var video, canvas;

var Pythonshell = require("python-shell");
var fs = require("fs");

function turnOnCamera() {
  isCameraRun = true;

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function(err) {
    console.log("An error occurred: " + err);
  });

  video.addEventListener('canplay', function(ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);
}

function turnOffCamera() {
  isCameraRun = false;
  video.pause();
  video.src="";
}

var isCameraRun = false;
function camera() {
  snoozeStack = 0;
  if (run) (isCameraRun) ? turnOffCamera() : turnOnCamera();
}


//IMAGE

var state = 3;
function checkFaceEye() {
  var context = canvas.getContext('2d');

  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    var data = canvas.toDataURL();
    var base64 = data.replace(/^data:image\/\w+;base64,/, "");

    pyshell = new Pythonshell.PythonShell("AI_smart_stopwatch/python/main.py");
    pyshell.send(base64);
    pyshell.on('message', function(message) {state = message});
    pyshell.end(err => {if (err) alert(err);});
  }
}

var statusContent = [
  '자리비움',
  '쉬는시간',
  '졸지마!',
  '열공중'
]

var snoozeStack = 0;
var leftseatStack = 0;
function checkState() {
  (state == 0) ? leftseatStack++ : leftseatStack = 0;
  (state == 2) ? snoozeStack++ : snoozeStack = 0;
  if (snoozeStack >= 10) {
    html = 1;
    stopTimer();
    runAlarm();
  }
  if (leftseatStack >= 100) {
    html = 1;
    stopTimer();
  }
  var html = 3;
  if (snoozeStack >= 2) html = 2;
  if (leftseatStack >= 2) html = 0;
  document.getElementById('status').innerHTML = statusContent[html];
}


// Alarm

var isAlarmOn = false;
function runAlarm() {
  isAlarmOn = true;
  document.getElementById('alarmPopup').style.display = "block";
  audio.play();
}

function stopAlarm() {
  isAlarmOn = false;
  document.getElementById('alarmPopup').style.display = "none";
  audio.pause();
}

var audio = new Audio('../media/Alarm_Sound.mp3');
audio.addEventListener('ended', function() {
  this.currentTime = 0;
  this.play();
}, false);

function initialize() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
}
