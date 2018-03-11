/*
  Filename: p2.js
  Author: David Piper
  Description:
    This file sets up and handles the onclick events of the
    collapse buttons.
*/

(function() {
  'use strict';

  function readMessages(messageBox) {
    var url = 'msgs.txt';

    var request = new XMLHttpRequest();
    request.addEventListener('load', function(event) {
      var data = event.target;
      if (data.status == 0 || data.status == 200) {
        messageBox.innerHTML = data.responseText;
      }
    });
    request.open('GET', url, true);
    request.send(null);
  }

  window.addEventListener('load', function() {
    var messageBox = document.getElementById('messageBox');
    readMessages(messageBox);

  });
})();
