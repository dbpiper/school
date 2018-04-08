/*
  Filename: p2.js
  Author: David Piper
  Description:
    This file sets up and handles the onclick events of the
    collapse buttons.
*/
// This convention of enclosing the file in an anonymous function,
// which is immediately invoked, is used to separate js files out into
// what are essentially pseudo-modules (that is they have separate scopes)
(function() {
  'use strict';
  /*
   strict mode enabled for the function/module this is another advantage
   of using pseudo-modules like this as strict mode for the function always
   applies as expected. if used for the file it can be unintentionally
   activated or deactivated if files are concatenated.

   See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
   for this gotcha, which Amazon fell victim to.
  */
  const COLLAPSED_WIDTH = 6.67022;
  const EXPANDED_WIDTH = 15;

  const COLLAPSED_HEIGHT = 10;
  const EXPANDED_HEIGHT = 25;

  function getCssVariables() {
    const styles = window.getComputedStyle(document.querySelector(':root'));
    return styles;
  }

  function getCssVariable(name) {
    return getCssVariables().getPropertyValue('--' + name);
  }

  function setCssVariable(name, value) {
    document.documentElement.style.setProperty('--' + name, value);
  }

  function setCssVariablePercent(name, value) {
    setCssVariable(name, value + '%');
  }

  function toggleCollapseHorizontal(cssVariableName, textElement, containerDiv) {
      const currentWidth = parseFloat((getCssVariable(cssVariableName)));
      let newWidth;

      if (currentWidth == COLLAPSED_WIDTH) {
        newWidth = EXPANDED_WIDTH;
      } else {
        newWidth = COLLAPSED_WIDTH;
      }

      textElement.classList.toggle('horizontal-collapse');
      containerDiv.classList.toggle('rotated-div');
      setCssVariablePercent(cssVariableName, newWidth);
  }

  function toggleCollapseHierarchy() {
      const hierarchyDiv = document.querySelector('#hierarchy > div > div');
      const hierarchyContainerDiv = document.querySelector('#hierarchy > div');

      toggleCollapseHorizontal('hierarchyWidth', hierarchyDiv,
        hierarchyContainerDiv);
  }

  function toggleCollapseInspector() {
      const inspectorDiv = document.querySelector('#inspector > div > div');
      const inspectorContainerDiv = document.querySelector('#inspector > div');

      toggleCollapseHorizontal('inspectorWidth', inspectorDiv,
        inspectorContainerDiv);
  }

  function toggleCollapseAssets() {
      const cssVariableName = 'assetHeight';
      const currentHeight = parseInt(getCssVariable(cssVariableName));
      let newHeight;

      if (currentHeight == COLLAPSED_HEIGHT) {
        newHeight = EXPANDED_HEIGHT;
      } else {
        newHeight = COLLAPSED_HEIGHT;
      }

      setCssVariablePercent(cssVariableName, newHeight);
  }


  window.addEventListener('load', function() {
    let hierarchyCollapseButton = document.querySelector('#hierarchy button');
    let assetsCollapseButton = document.querySelector('#assets button');
    let inspectorCollapseButton = document.querySelector('#inspector button');

    hierarchyCollapseButton.addEventListener('click', toggleCollapseHierarchy);
    assetsCollapseButton.addEventListener('click', toggleCollapseAssets);
    inspectorCollapseButton.addEventListener('click', toggleCollapseInspector);


  });
})();
