var gl, points;
var NumPoints = 1000000;
var currentFern = 0; // will be changed to 1 on first click and vis ver
var currentGreen = 0; // will be changed to 1 on first selection of 'c' key

function getRandomSeriesNumber2() {
  var num=Math.random();
  if(num < 0.1) return 0;  //probability 0.
  else if(num < 0.17) return 1; // probability 0.07
  else if(num < 0.24) return 2; //probability 0.07
  else return 3;  //probability 0.85
}

function getRandomSeriesNumber1() {
  var num=Math.random();
  if(num < 0.1) return 0;  //probability 0.1
  else if(num < 0.18) return 1; // probability 0.08
  else if(num < 0.26) return 2; //probability 0.08
  else return 3;  //probability 0.74
}


function selectSeriesFern1()
{
	var series1 = [
		0.0,
		0.0,
		0.0,
		0.16,
		0.0,
		0.0
	];
		
	var series2 = [
		0.2,
		-0.26,
		0.23,
		0.22,
		0.0,
		1.6
	];
	
	var series3 = [
		-0.15,
		0.28,
		0.26,
		0.24,
		0.0,
		0.44
	];
	
	var series4 = [
		0.75,
		0.04,
		-0.04,
		0.85,
		0.0,
		1.6
	];
	
	var seriesList = [series1, series2, series3, series4];
	return seriesList[getRandomSeriesNumber1()];
	
}

function selectSeriesFern2()
{
	var series1 = [
		0.0,
		0.0,
		0.0,
		0.16,
		0.0,
		0.0
	];
		
	var series2 = [
		0.2,
		-0.26,
		0.23,
		0.22,
		0.0,
		1.6
	];
	
	var series3 = [
		-0.15,
		0.28,
		0.26,
		0.24,
		0.0,
		0.44
	];
	
	var series4 = [
		0.85,
		0.04,
		-0.04,
		0.85,
		0.0,
		1.6
	];
	
	var seriesList = [series1, series2, series3, series4];
	return seriesList[getRandomSeriesNumber2()];
	
}

function generatePoint(previousPoint)
{
	var series;
	if (currentFern == 0) {
		series = selectSeriesFern1();
	} else {
		series = selectSeriesFern2();
	}
	
	var x = series[0]*previousPoint[0] + series[1]*previousPoint[1] + series[4]; // e
	var y = series[2]*previousPoint[0] + series[3]*previousPoint[1]  +  series[5]; //f
	
	return [x, y];
}

function scalePointToRange(point, largestX, largestY, smallestX, smallestY)
{
	var x = (point[0] - smallestX)/(largestX - smallestX) *  2 - 1;
	var y = (point[1] - smallestY)/(largestY - smallestY) * 2 - 1;
	return [x, y];
}

function drawFern()
{
	var p = [Math.random(), Math.random()];
	
	// choose real random point
	for (var i = 0; i < 100; i++) {
		p = generatePoint(p);
	}
	

    // And, add our initial point into our array of points
    points = [ p ];
	var largestX = 0;
	var largestY = 0;
	var smallestX = 100000;
	var smallestY = 100000;
    // Compute new points
    for ( var i = 0; points.length < NumPoints; ++i ) {
		p = generatePoint(p)
		if (p[0] > largestX) {
			largestX = p[0];
		}
		if (p[0] < smallestX) {
			smallestX = p[0];
		}
		if (p[1] > largestY) {
			largestY = p[1];
		}
		if (p[1] < smallestY) {
			smallestY = p[1]
		}
        points.push( p );
    }
	
	for (var i = 0; i < points.length; i++) {
		points[i] = scalePointToRange(points[i], largestX, largestY, smallestX, smallestY);
	}
	
	return points;
}

function click()
{
	if (currentFern == 0) {
		currentFern = 1;
	} else {
		currentFern = 0;
	}
	main();
}

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
	
	
	
    //  Configure WebGL
    //gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    if (!program) { console.log('Failed to intialize shaders.'); return; }
    gl.useProgram( program );
     
	// Get the storage location of u_FragColor
	var u_FragColor = gl.getUniformLocation(program, "u_FragColor");
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}
	 
	// Register function (event handler) to be called on a mouse press
	canvas.onmousedown = function(ev){ click() };
	
	
	window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
		switch( key ) {
		case 'c':
		case 'C':
			if (currentGreen == 0) {
				currentGreen = 1;
			} else if (currentGreen == 1) {
				currentGreen = 0;
			}
			main();
            break;
        }
    };
	
	
	
	
	var points = drawFern();
	
	if (currentGreen == 0) {
		gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
	} else {
		gl.uniform4f(u_FragColor, 0.0, 0.6, 0.4, 1.0);
	}
	
	
	
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}
