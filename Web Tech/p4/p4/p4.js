/*
  Filename: p4.js
  Author: David Piper
  Description:
*/

const p4Module = (function() {
  'use strict';

  function dropped(event) {
    const dragbox = document.getElementById('dragbox');
    event.preventDefault();
    var files = event.dataTransfer.files;
    if (files.length) {
        var list = '';
        for (var f = 0; f < files.length; f++) {
          var file = files[f];
          list += '<div>File: ' + file.name;
          list += '<br><span><progress value="0" max="100">0%</progress></span>';
          list += '</div>';
        }
        dragbox.innerHTML = list;
    }

  }

  window.addEventListener('load', function() {
    const dragbox = document.getElementById('dragbox');
    dragbox.addEventListener('dragenter', function(event) {
      event.preventDefault();
    });
    dragbox.addEventListener('dragover', function(event) {
      event.preventDefault();
    });
    dragbox.addEventListener('drop', dropped);
  });

  return {
    fileSelected: function() {
    }
  }
})();
