var ghostBoundingBox;
var arrowBoundingBox;

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];
var colors=[];

var cmtStack=[];

// rotate takes angles in degrees
var ringRotationAngle = 60;

// used to automate the drawaing process
var numPointsDrawn;

var PLANET_POINTS = 80;
var GHOST_POINTS = 114;
var STAR_POINTS = 6;
var SKY_POINTS = 4;
var GROUND_POINTS = 4;

function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

    initWebGL();

    render();
}

function createBoundingBox(startPoint, numPoints) {
    var lowestX = 999999;
    var highestX = -99999;
    var lowestY = 999999;
    var highestY = -999999;

    for (var i = 0; i < numPoints; i++) {
      var point = points[startPoint + i];
      if (point[0] < lowestX) {
        lowestX = point[0];
      }
      if (point[0] > highestX) {
        highestX = point[0];
      }
      if (point[1] < lowestY) {
        lowestY = point[1];
      }
      if (point[1] > highestY) {
        highestY = point[1];
      }
    }
    return new BoundingBox(lowestX, highestX, highestY, lowestY);
}

function initWebGL() {
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}


function RGBValueToDecimal(rgbValue) {
	return rgbValue / 255;
}

function RGBToDecimal(rgbVector) {
	return vec4(RGBValueToDecimal(rgbVector[0]),
				RGBValueToDecimal(rgbVector[1]),
				RGBValueToDecimal(rgbVector[2]),
				rgbVector[3]);
}

function GeneratePoints() {
    	GeneratePlanet();
    	GenerateGhost();
		GenerateStar();
		GenerateSky();
		GenerateGround();
		GenerateMountain();

		var green = RGBToDecimal(vec4(46, 139, 87, 1));
		var yellow = RGBToDecimal(vec4(255, 255, 0, 1));
		var red = RGBToDecimal(vec4(255, 0, 0, 1));
		var purple = RGBToDecimal(vec4(128, 0, 128, 1));


		GenerateEllipse(1, 1, green);
		GenerateEllipse(1, 1, yellow);
		GenerateEllipse(1, 1, red);
		GenerateEllipse(1, 1, purple);

		GenerateBowBack();
		GenerateBowString();

		GenerateArrowShaft();
}

function GenerateArrowShaft() {
	var blue = vec4(0, 0, 1, 1);
	points.push(vec2(1, 1));
	colors.push(blue);
	points.push(vec2(0, 0));
	colors.push(blue);
	points.push(vec2(0, 2));
	colors.push(blue);
	points.push(vec2(1, 2));
	colors.push(blue);

  points.push(vec2(-1, 1));
	colors.push(blue);
	points.push(vec2(0, 0));
	colors.push(blue);
	points.push(vec2(0, 2));
	colors.push(blue);
	points.push(vec2(-1, 2));
	colors.push(blue);

  arrowBoundingBox = createBoundingBox(1833, 8);
}

function GenerateBowString() {
	var yellow = vec4(1, 1, 0, 1);
	GenerateEllipseTop(1, 1, yellow);
}

function GenerateBowBack() {
	var yellow = vec4(1, 1, 0, 1);
	points.push(vec2(-1, 0));
	colors.push(yellow);
	points.push(vec2(1, 0));
	colors.push(yellow);
}


// from
// https://www.opengl.org/discussion_boards/showthread.php/123411-How-to-draw-an-oval
function GenerateEllipse(xradius, yradius, color) {

	for(var i=0; i < 360; i++)
	{
		 //convert degrees into radians
		var degInRad = i*(2*Math.PI/360);
		var x = Math.cos(degInRad)*xradius;
		var y = Math.sin(degInRad)*yradius;
		points.push(vec2(x, y));
		colors.push(color);
	}

}

function GenerateEllipseTop(xradius, yradius, color) {

	for(var i=0; i < 180; i++)
	{
		 //convert degrees into radians
		var degInRad = i*(2*Math.PI/360);
		var x = Math.cos(degInRad)*xradius;
		var y = Math.sin(degInRad)*yradius;
		points.push(vec2(x, y));
		colors.push(color);
	}

}

function GenerateMountain() {
	var darkBrown = vec4(0.52, 0, 0, 1);
	points.push(vec2(0, 1));
	colors.push(darkBrown);
	points.push(vec2(0.5, 0));
	colors.push(darkBrown);
	points.push(vec2(1, 1));
	colors.push(darkBrown);
}

function GenerateSky() {
	var darkPurple = vec4(0.294, 0, 0.51, 1);
	var lightPurple = vec4(0.51, 0, 0.51, 1);
	points.push(vec2(0, 0));
	colors.push(lightPurple);
	points.push(vec2(0, 1));
	colors.push(darkPurple);
	points.push(vec2(1, 0));
	colors.push(lightPurple);
	points.push(vec2(1, 1));
	colors.push(darkPurple);
}

function GenerateGround() {
	var darkGreen = vec4(0, 0.29, 0, 1);
	var lightGreen = vec4(0.42, 0.46, 0.14, 1);
	points.push(vec2(0, 0));
	colors.push(lightGreen);
	points.push(vec2(0, 1));
	colors.push(darkGreen);
	points.push(vec2(1, 0));
	colors.push(lightGreen);
	points.push(vec2(1, 1));
	colors.push(darkGreen);
}

function GenerateStar() {
	points.push(vec2(0, 2));
	colors.push(vec4(1, 1, 0, 1));
    points.push(vec2(0.1,1));
	colors.push(vec4(1, 1, 0, 1));
    points.push(vec2(0.4, 1));
    colors.push(vec4(1, 1, 0, 1));
	points.push(vec2(0, 4));
	colors.push(vec4(1, 1, 0, 1));
    points.push(vec2(-1, -0.3));
	colors.push(vec4(1, 1, 0, 1));
    points.push(vec2(-0.5, -0.5));
	colors.push(vec4(1, 1, 0, 1));
}

function GeneratePlanet() {
	var Radius=1.0;
	var numPoints = 80;

	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints);
		var X = Math.cos( Angle )*Radius;
		var Y = Math.sin( Angle )*Radius;
	        colors.push(vec4(0.7, 0.7, 0, 1));
		points.push(vec2(X, Y));

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}
}

function GenerateGhost() {
        // begin body  (87 points)
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.1, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 3.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.1, 3.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(5.5, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6,3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.7, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6.8, 2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7, 2.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(8.5, 1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9, 1.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 0.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.4, -2.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.5, -3.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.7, -1.7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, -1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11.2, -1.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(13, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.8, -0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(12.5, 0.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(11, 1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.8, 1.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10.2, 2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(10, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(9.8, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(7.5, 9.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(6, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(.5, 15));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, 17));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.8, 17.4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 16.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, 10.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, 10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 8.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 7.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12.5, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, 3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13.5, -1));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-13, -2.3));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-12, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, 1.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 4.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, 5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6.5, 4.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4.5, 6.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, 4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.2, 2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, 0));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5.5, -2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-6, -5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-7, -8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-8, -10));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-9, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10, -14.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-10.5, -15.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-11, -17.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -14));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-4, -11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-5, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, -12.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(0, -11.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(1, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3.5, -7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, -4));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4, -3.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(4.5, -2.5));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(3, 0));
        colors.push(vec4(1, 1, 1, 1));
        // end body

	// begin mouth (6 points)
	points.push(vec2(-1, 6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.5, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-0.2, 8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 8.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 7));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.5, 5.8));
        colors.push(vec4(1, 1, 1, 1));
        // end mouth

	// begin nose (5 points)
	points.push(vec2(-1.8, 9.2));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1, 9.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.1, 10.6));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.6, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-1.9, 10));
        colors.push(vec4(1, 1, 1, 1));

        // begin left eye, translate (2.6, 0.2, 0) to draw the right eye
        // outer eye, draw line loop (9 points)
	points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.5, 13));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));

        // eye ball, draw triangle_fan (7 points)
	points.push(vec2(-2.5, 11.4));  // middle point
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.8));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.2, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 12));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-3, 11));
        colors.push(vec4(1, 1, 1, 1));
	points.push(vec2(-2.9, 10.5));
        colors.push(vec4(1, 1, 1, 1));
        // end left eye
  ghostBoundingBox = createBoundingBox(80, GHOST_POINTS);
}

function DrawGhost() {
    modelViewStack.push(modelViewMatrix);

    ghostBoundingBox.scale(1/10, 1/10);
    modelViewMatrix = mat4();
    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 80, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 167, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 173, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 178, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 178, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 187, 7);  // right eye ball

    modelViewMatrix = modelViewStack.pop();
}

function DrawFullPlanet() {

	modelViewStack.push(modelViewMatrix);

	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-4, 5, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(1, 1*1.618, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // draw planet circle
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 80);

	modelViewMatrix = modelViewStack.pop();
}


function DrawOneStarTranslate(x, y)
{
    // draw the full star
    for (var i=1; i <= 5; i++) {
         modelViewStack.push(modelViewMatrix);

		 t = translate(x, y, 0);
         r = rotate(72*i, 0, 0, 1);
		 modelViewMatrix = r;

         modelViewMatrix = mult(t, r);
         DrawOneBranch();

		 modelViewMatrix = modelViewStack.pop();

    }
}

function DrawOneStar()
{
    // draw the full star
    for (var i=1; i <= 5; i++) {
         r = rotate(72*i, 0, 0, 1);
         modelViewMatrix = r;
         modelViewMatrix = r;
         DrawOneBranch();

    }
}

function DrawOneBranch()
{
    var s;

    // one branch
    s = scale4(1/32, 1/32, 1);
    modelViewStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 194, 6);
	modelViewMatrix = modelViewStack.pop();

    /*
    modelViewMatrix = modelViewStack.pop();
    //s = scale4(1/8, -1/8, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 0, vertices.length);
    */
}

function DrawSky() {
    var s;

	 modelViewStack.push(modelViewMatrix);

    s = scale4(20, 8, 1);
	var t = translate(-10, 0, 0);

	modelViewMatrix = mult(modelViewMatrix, t);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_STRIP, 200, 4);

	modelViewMatrix = modelViewStack.pop();

}

function DrawGround() {
    var s;

	 modelViewStack.push(modelViewMatrix);

    s = scale4(20, 8, 1);
	var t = translate(-10, -8, 0);

	modelViewMatrix = mult(modelViewMatrix, t);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_STRIP, 204, 4);

	modelViewMatrix = modelViewStack.pop();

}

function DrawMountain() {

	modelViewStack.push(modelViewMatrix);

    var s = scale4(5, -5, 1);
	var t = translate(-8, 4, 0);

	modelViewMatrix = mult(modelViewMatrix, t);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_STRIP, 208, 3);

	modelViewMatrix = modelViewStack.pop();
}

function DrawMountain2() {

	modelViewStack.push(modelViewMatrix);

    var s = scale4(5, -5, 1);
	var t = translate(3, 0, 0);

	modelViewMatrix = mult(modelViewMatrix, t);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_STRIP, 208, 3);

	modelViewMatrix = modelViewStack.pop();
}

function DrawGreenRingBack() {
		modelViewStack.push(modelViewMatrix);

    var s = scale4(2, 1, 1);
	var t = translate(-4, 5, 0);

	var rAngle = ringRotationAngle;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 211, 180);

	modelViewMatrix = modelViewStack.pop();
}

function DrawGreenRingFront() {
		modelViewStack.push(modelViewMatrix);

    var s = scale4(2, 1, 1);
	var t = translate(-4, 5, 0);

	var rAngle = ringRotationAngle;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 391, 180);

	modelViewMatrix = modelViewStack.pop();
}


function DrawYellowRingBack() {
		modelViewStack.push(modelViewMatrix);

    var s = scale4(1.8, 1, 1);
	var t = translate(-4, 5, 0);

	var rAngle = ringRotationAngle;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 571, 180);

	modelViewMatrix = modelViewStack.pop();
}

function DrawYellowRingFront() {
		modelViewStack.push(modelViewMatrix);

    var s = scale4(1.8, 1, 1);
	var t = translate(-4, 5, 0);

	var rAngle = ringRotationAngle;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 751, 180);

	modelViewMatrix = modelViewStack.pop();
}

function DrawRedRingBack() {
		modelViewStack.push(modelViewMatrix);

    var s = scale4(1.6, 1, 1);
	var t = translate(-4, 5, 0);

	var rAngle = ringRotationAngle;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 931, 180);

	modelViewMatrix = modelViewStack.pop();
}

function DrawRedRingFront() {
		modelViewStack.push(modelViewMatrix);

    var s = scale4(1.6, 1, 1);
	var t = translate(-4, 5, 0);

	var rAngle = ringRotationAngle;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 1111, 180);

	modelViewMatrix = modelViewStack.pop();
}


function DrawPurpleRingBack() {
		modelViewStack.push(modelViewMatrix);

    var s = scale4(1.4, 1, 1);
	var t = translate(-4, 5, 0);

	var rAngle = ringRotationAngle;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 1291, 180);

	modelViewMatrix = modelViewStack.pop();
}

function DrawPurpleRingFront() {
	modelViewStack.push(modelViewMatrix);

    var s = scale4(1.4, 1, 1);
	var t = translate(-4, 5, 0);

	// rotate takes angle in degrees
	var rAngle = ringRotationAngle;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 1471, 180);

	modelViewMatrix = modelViewStack.pop();
}

function DrawBow() {
	modelViewStack.push(modelViewMatrix);

  var s = scale4(1/10, 1/10, 1);
	var t = translate(0, -5, 0);

	// rotate takes angle in degrees
	var rAngle = 0;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
  modelViewMatrix = mat4();
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
	DrawBowBack();
	DrawBowString();

	modelViewMatrix = modelViewStack.pop();
}

function DrawBowBack() {
	modelViewStack.push(modelViewMatrix);

    var s = scale4(10, 10, 1);
	var t = translate(0, 0, 0);

	// rotate takes angle in degrees
	var rAngle = 0;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 1651, 2);

	modelViewMatrix = modelViewStack.pop();
}

function DrawBowString() {
	modelViewStack.push(modelViewMatrix);

  var s = scale4(10, 10, 1);
	var t = translate(0, 0, 0);

	// rotate takes angle in degrees
	var rAngle = 0;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 1653, 180);

	modelViewMatrix = modelViewStack.pop();
}

function DrawArrow() {
	modelViewStack.push(modelViewMatrix);

  var s = scale4(0.3, -0.7, 1);
	var t = translate(0, -4, 0);

	// rotate takes angle in degrees
	var rAngle = 0;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
  modelViewMatrix = mat4();
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
  arrowBoundingBox.scale(0.3, -0.7);
  arrowBoundingBox.translate(0, -4);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.LINE_STRIP, 1833, 4);
  gl.drawArrays( gl.LINE_STRIP, 1837, 4);

	modelViewMatrix = modelViewStack.pop();
}

function DrawArrowRightHalf() {
	modelViewStack.push(modelViewMatrix);

  var s = scale4(2, -5, 1);
	var t = translate(0, 0, 0);

	// rotate takes angle in degrees
	var rAngle = 0;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 1833, 4);

	modelViewMatrix = modelViewStack.pop();
}


function DrawArrowLeftHalf() {
	modelViewStack.push(modelViewMatrix);

    var s = scale4(-1, 1, 1);
	var t = translate(0, 0, 0);

	// rotate takes angle in degrees
	var rAngle = 0;

	var r = rotate(rAngle, 0, 0, 1);

	var m = mult(t, r);
	modelViewMatrix = mult(modelViewMatrix, m);
	modelViewMatrix = mult(modelViewMatrix, s);
	DrawArrowRightHalf();

	modelViewMatrix = modelViewStack.pop();
}


// from Mozilla + stackoverflow
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
}

function DrawStars()
{
	for (var i = 0; i < 50; i++) {
		x = getRandomFloat(-8, 8);
		y = getRandomFloat(0.25, 8);
		DrawOneStarTranslate(x, y);
	}
}

function render() {
       gl.clear( gl.COLOR_BUFFER_BIT );
       gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
       gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

       // draw ground and sky first
	   DrawGround();
	   DrawSky();

       // draw stars and mountains... next
	   DrawStars();
	   DrawMountain();
	   DrawMountain2();

       // then, draw planet, add rings too
	   DrawGreenRingBack();
	   DrawYellowRingBack();
	   DrawRedRingBack();
	   DrawPurpleRingBack();

     DrawFullPlanet();

	   DrawGreenRingFront();
	   DrawYellowRingFront();
	   DrawRedRingFront();
	   DrawPurpleRingFront();

     // then, draw ghost
     DrawGhost();



       // add other things, like bow, arrow, spider, flower, tree ...
	   DrawBow();
     DrawArrow();

}
