var gl, program;

function main() {

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = WebGLUtils.setupWebGL( canvas );
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  //  Load shaders and initialize attribute buffers
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  if (!program) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(program, "a_Position");
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(program, "u_FragColor");
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position, u_FragColor) };

  render();
}

function render() {
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var points = [];  // The array for the position of a mouse press
var colors = [];  // The array to store the color of a point

function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  // Store the coordinates to the "points" array
  points.push([x, y]);

  // Store the colors to the "colors" array
  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y >= 0.0) { // Second quadrant
    colors.push([0.0, 0.0, 1.0, 1.0]);  // Blue 
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else if (x >=0.0 && y< 0.0) { // Fourth quadrant
    colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Display all the points
  var len = points.length;
  for(var i = 0; i < len; i++) {
    var xy = points[i];
    var rgba = colors[i];

    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
