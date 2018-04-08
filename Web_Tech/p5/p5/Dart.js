/*
  Filename: Dart.js
  Author: David Piper
  Description:
    The Dart module, which defines the Dart class which handles dart-related
    actions such as drawing the dart and setting its color, this is also
    used by P5 module to count the number of darts in/out of board.
*/
var Dart = (function() {
  'use strict';

  const onBoardColor = '#0000FF'; // blue color for on board
  const outsideBoardColor = '#FFA500'; // orange color for outside board

  var Dart = class Dart {

    constructor(radius, canvasDimension) {
      this.center = {
        x: Dart.randFloatInRange(0, canvasDimension - radius),
        y: Dart.randFloatInRange(0, canvasDimension - radius),
      };

      this.radius = radius;
      this.canvasDimension = canvasDimension;

      if (Dart.isDartOnBoard(radius, canvasDimension, this.center)) {
        this.fillColor = onBoardColor;
        this.onBoard = true;
      } else {
        this.fillColor = outsideBoardColor;
        this.onBoard = false;
      }
    }

    // instance methods

    // draws the dart object on given 2d canvas context
    drawOnCanvas(context) {
      context.fillStyle = this.fillColor;

      context.beginPath();
      context.arc(this.center.x, this.center.y, this.radius, 0,
          2 * Math.PI, false);
      context.fill();
    }

    // static methods

    // generate a random float within the given bounds
    static randFloatInRange(lowerBound, upperBound) {
        return Math.random() * (upperBound - lowerBound) + lowerBound;
    }

    /*
      is the majority (3 or more cardinal sides) of the dart on the board?

      this definition of "on the board" is used, as I tried several
      different methods including:
        * are all 4 cardinal sides on the board?
        * is the center on the board?
        * are 2 or more cardinal sides on the board?
        * is 1 cardinal side on the board?
      and all of these seemed to significantly either under-estimate or
      over-estimate pi, however when I used 3 or more as the definition,
      pi seems to be approximated the most accurately
      (out of the options tested).
    */
    static isDartOnBoard(radius, canvasDimension, center) {
      const convertedCenter =
        Dart.convertPointToCenterCoordinate(canvasDimension, center);
      const left = {
        x: convertedCenter.x - radius,
        y: convertedCenter.y,
      };
      const right = {
        x: convertedCenter.x + radius,
        y: convertedCenter.y,
      };
      const top = {
        x: convertedCenter.x,
        y: convertedCenter.y - radius,
      };
      const bottom = {
        x: convertedCenter.x,
        y: convertedCenter.y + radius,
      };

      let onBoard = 0;


      if (Dart.isPointOnBoard(canvasDimension, left)) {
        onBoard++;
      }
      if (Dart.isPointOnBoard(canvasDimension, right)) {
        onBoard++;
      }
      if (Dart.isPointOnBoard(canvasDimension, top)) {
        onBoard++;
      }
      if (Dart.isPointOnBoard(canvasDimension, bottom)) {
        onBoard++;
      }
      return onBoard >= 3; // is the majority of the dart on the board
    }

    /*
      converts a point from the coordinate system where the origin
      is the top left and down is positive y to the coordinate system
      where the origin is the center of the canvas and the right of the origin
      is positive x, the left of the origin is negative x, down from the origin
      is negative y, and up from the origin is positive y.

      this is needed in order to be able to use the pythagorean theorm to
      find the distance an point is from the origin (as it assumes that the
      origin is at the center with the aforementioned coordinate system).
    */
    static convertPointToCenterCoordinate(canvasDimension, point) {
      return {
        x: point.x - canvasDimension/2,
        y: canvasDimension/2 - point.y,
      }
    }

    // use the pythagorean theorem to compute distance
    // of a point from the origin and if it is <= the radius of the board
    // then it is on the board
    static isPointOnBoard(canvasDimension, point) {
      const distanceFromCenter = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
      return distanceFromCenter < canvasDimension/2
      || Dart.floatAlmostEqual(distanceFromCenter, canvasDimension/2);
    }

    // need this function to test float equality/closeness
    static floatAlmostEqual(n1, n2) {
      return Math.abs(n1 - n2) <= Math.EPSILON;
    }
  }

  return {
      Dart: Dart,
  }

})();
