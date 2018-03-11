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
      location.reload(); // reload the page to remove the item from the box
    });

    readMessages(messageBox);

    userNameInput.value = sessionStorage.getItem('name');

  });
})();
