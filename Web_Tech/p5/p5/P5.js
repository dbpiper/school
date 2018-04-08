/*
  Filename: P5.js
  Author: David Piper
  Description:
    Handles the drawing, fetching and playing of sounds for project 5.
*/

var P5 = (function() {
  'use strict';

  // module constants
  const backgroundColor = '#FF0000'; // red background
  const boardColor = '#00FF00'; // green board
  const dartRadius = 5;

  // module global variables
  let numDartsOnBoard = 0;
  let numDartsOffBoard = 0;

  let canvas;
  let context;
  let audioContext;
  let audioBuffer;

  // sets the canvas objects and size
  function setCanvasSize() {
      canvas = document.getElementById('canvas');
      context = canvas.getContext('2d'); // go ahead and set the context
      // const context = canvas.getContext('2d');
      const dimension = document.getElementById('canvas_dimension').value;
      canvas.width = dimension;
      canvas.height = dimension;
  }

  // draw the background
  function drawBackground() {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  // draw the dartboard
  function drawDartboard() {
    context.fillStyle = boardColor;

    context.beginPath();
    context.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, 2 * Math.PI, false);
    context.fill();
  }

  // create and draw the darts
  // note: the new Darts created where
  // will be garbage collected as soon as they go
  // out of scope (after function exits).
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

  // draw the canvas objects
  function drawObjects() {
    drawBackground();
    drawDartboard();
    drawDarts();
  }

  // aproximate pi
  function approximatePi() {
    return 4 * (numDartsOnBoard/(numDartsOnBoard + numDartsOffBoard));
  }

  // sets the number for pi approxmation
  function setPiApproxmationText() {
    const span = document.getElementById('pi_approximation');
    span.innerHTML = approximatePi().toString();
    const pi_p = document.getElementById('pi_p');
    pi_p.style.display = 'block';
  }


  // plays the gunshot sound
  function playGunshotSound() {
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContext.destination);
      sourceNode.start(0);
  }

  // reset the module's global variables each time this is called
  // this is needed to keep the number of darts from increasing
  // each time fire button is pressed
  function resetVariables() {
    numDartsOnBoard = 0;
    numDartsOffBoard = 0;

    canvas = null;
    context = null;
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


  // the exported variables/functions from this module: namely fire function
  return {
    fire: function() {
      resetVariables();
      playGunshotSound();
      setCanvasSize();
      drawObjects();
      setPiApproxmationText();
    }
  }
})();
