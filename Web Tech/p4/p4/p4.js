/*
  Filename: p4.js
  Author: David Piper
  Description:
*/

var p4Module = (function() {
  'use strict';

  function dropped(event) {
    const dragbox = document.getElementById('dragbox');
    event.preventDefault();
    var files = event.dataTransfer.files;
    uploadFilesWithList(files);
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

  function uploadProgress(event) {
    if (event.lengthComputable) {
      var percentComplete = Math.round(event.loaded * 100 / event.total);
      document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
    } else {
      document.getElementById('progressNumber').innerHTML = 'Unable to compute';
    }
  }

  function uploadComplete(event) {
    alert(event.target.responseText);
  }

  function uploadFailed(event) {
    alert('There was an error attempting to upload the file.');
  }

  function uploadCanceled(event) {
    alert('The upload has been canceled by the user or the browser dropped the connection.');
  }

  function uploadFilesWithList(files) {
      var fd = new FormData();

      for (var i = 0, file; file = files[i]; i++) {
        fd.append(file.name, file);
      }
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', uploadProgress, false);
      xhr.addEventListener('load', uploadComplete, false);
      xhr.addEventListener('error', uploadFailed, false);
      xhr.addEventListener('abort', uploadCanceled, false);
      xhr.open("POST", 'cgi-bin/uploadHandler.py');
      xhr.overrideMimeType('application/octet-stream');
      xhr.send(fd);
  }

  return {
    uploadFiles: function() {
      const files = document.getElementById('fileToUpload').files;
      uploadFilesWithList(files);
    }
  }
})();
