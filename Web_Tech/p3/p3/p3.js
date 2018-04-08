/*
  Filename: p3.js
  Author: David Piper
  Description:
    This file handles loading the messages from the file and registering the event handlers.
*/

(function() {
  'use strict';

  function readMessages(messageBox) {
    const url = 'msgs.txt';

    const request = new XMLHttpRequest();
    request.addEventListener('load', function(event) {
      const data = event.target;
      if (data.status == 0 || data.status == 200) {
        messageBox.innerHTML = data.responseText;
      }
    });
    request.open('GET', url, true);
    request.send(null);
  }

  window.addEventListener('load', function() {
    const messageBox = document.getElementById('messageBox');
    const userNameInput = document.getElementById('name');
    const submitButton = document.querySelector('#submitDiv > button');
    const clearButton = document.querySelector('#clearStorageDiv > button');
    submitButton.addEventListener('click', function() {
        if (!sessionStorage.getItem('name')) {
          sessionStorage.setItem('name', userNameInput.value);
        }
    });
    clearButton.addEventListener('click', function() {
      sessionStorage.clear(); // just remove everything instead of only removingItem
      userNameInput.value = '';
    });

    readMessages(messageBox);

    userNameInput.value = sessionStorage.getItem('name');

  });
})();
