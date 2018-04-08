/*
  Filename: p5.js
  Author: David Piper
  Description:
*/

var P5 = (function() {
  'use strict';

  const backgroundColor = '#FF0000'; // red background
  const boardColor = '#00FF00'; // green board
  const dartRadius = 5;
  let numDartsOnBoard = 0;
  let numDartsOffBoard = 0;

  let canvas;
  let context;
  let audioContext;
  let audioBuffer;

  function setCanvasSize() {
      canvas = document.getElementById('canvas');
      context = canvas.getContext('2d'); // go ahead and set the context
      // const context = canvas.getContext('2d');
      const dimension = document.getElementById('canvas_dimension').value;
      canvas.width = dimension;
      canvas.height = dimension;
  }

  function drawBackground() {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawDartboard() {
    context.fillStyle = boardColor;

    context.beginPath();
    context.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, 2 * Math.PI, false);
    context.fill();
  }

  function drawDarts() {
    const numDarts = document.getElementById('num_darts').value;

    for(let i = 0; i < numDarts; i++) {
      let dart = new Dart.Dart(dartRadius, canvas.width);
      dart.drawOnCanvas(context);
      if (dart.onBoard) {
        numDartsOnBoard++;
      } else {
        numDartsOffBoard++;
      }
    }
  }

  function drawObjects() {
    drawBackground();
    drawDartboard();
    drawDarts();
  }

  function approximatePi() {
    return 4 * (numDartsOnBoard/(numDartsOnBoard + numDartsOffBoard));
  }

  function setPiApproxmationText() {
    const span = document.getElementById('pi_approximation');
    span.innerHTML = approximatePi().toString();
    const pi_p = document.getElementById('pi_p');
    pi_p.style.display = 'block';
  }

  function playGunshotSound() {
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContext.destination);
      sourceNode.start(0);
  }

  // load the sound file
  window.addEventListener('load', function() {
    audioContext = new AudioContext();

    const fileUrl = 'resources/sounds/gunshot.wav';
    const request = new XMLHttpRequest();
    const fireBtn = document.getElementById('fire_btn');

    request.responseType = 'arraybuffer';
    request.addEventListener('load', function() {
      if (request.status == 0 || request.status == 200) {
        audioContext.decodeAudioData(request.response, function(buffer) {
          audioBuffer = buffer;
          fireBtn.disabled = false;
        });
      }
    });
    request.open('GET', fileUrl, true);
    request.send();
  });

  return {
    fire: function() {
      playGunshotSound();
      setCanvasSize();
      drawObjects();
      setPiApproxmationText();
    }
  }
})();
