/* The purpose of this program is to demonstrate 2D transformations. 
 
 Input to the program comes from the keyboard.  
 Either an i, y, z, x, d, r, s, g, p, and q
 cause the program to perform some transformation.
 
 Tips:  The following keys perform the associated action:
 i/I -- load the identity matrix (restore the original image)

 y/Y -- translate by .1 in x
 z/Z -- rotate by 15 degrees about the origin
 x/X -- scale down by 0.8 about the origin
 d/D -- scale up by 1.2 about the origin

 r/R -- rotate by 15 degrees about the lower left corner of the rectangle
 S -- scale down by 0.7 about the lower left corner of the rectangle
 G -- scale up by 1.2 about the lower left corner of the rectangle

 p/P -- push onto the matrix stack
 q/Q -- pop from the matrix stack
*/

var gl, points, program;

var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;  // referring to locations of variables on shader programs
var colorIndexLoc;

var modelViewStack=[];  // for maintaining the current model view matrix
var points = [ // two squares 
    vec2( -.6, -.6),
    vec2(  .6, -.6),
    vec2(  .6, .6),
    vec2( -.6, .6),

    vec2( -.4, -.4 ),
    vec2(  .4,  -.4 ),
    vec2( .4, .4),
    vec2( -.4,  .4 )
];

function main() {

    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    initBuffers(gl);

	// event handler for keyboard entries
    window.onkeydown = function(event) {
        var key=String.fromCharCode(event.keyCode);
        switch (key)  {

	    //Perform a translation in along x axis
	    case 'Y':
		    var t = translate(.1, 0.0, 0.0);
            modelViewMatrix=mult(modelViewMatrix, t);
            break;
	
	    //Perform a 15 degree rotation about the origin around the z axis
	    case 'Z':
		    var r = rotate(15, 0.0, 0.0, 1.0);
            modelViewMatrix=mult(modelViewMatrix, r);
            break;

	    //Perform a scale down about the origin
	    case 'X':
		    var s=scale4(.8, .8, 1.0);
            modelViewMatrix=mult(modelViewMatrix, s);
		    break;

	    //Perform a scale up about the origin
	    case 'D':
		    var s=scale4(1.2, 1.2, 1.0);
            modelViewMatrix=mult(modelViewMatrix, s);
		    break;

	    //Reset all transformations
	    case 'I':
		    modelViewMatrix=mat4();
		    break;

	    //Perform a 15 degree Rotation about the lower left corner of the rectangle
	    case 'R':
		    // t1: The translate temporarily moves the lower left corner of the 
            // rectangle (-.6, -.6) to the origin (0, 0)
		    // r: rotate about the origin for 15 degree
		    // t2: then moves the lower left corner back to its original position 
            // The model matrix:   t2 * r * t1
            // t1 is the first operation to be applied, thus the closest to the point, 

		    var t1=translate(.6, .6, 0.0);
		    var r=rotate(15.0, 0.0, 0.0, 1.0);
		    var t2=translate(-.6, -.6, 0.0);
            modelViewMatrix = mult(mult(mult(modelViewMatrix, t2), r), t1);
            break;        
	
	    //Perform a scale down about the lower left corner of the white rectangle
	    case 'S':
		    // t1: The translate temporarily moves the lower left corner of the 
            // rectangle (-.6, -.6) to the origin (0, 0)
    		// s: scale down by 0.7 about the origin
		    // t2: then moves the lower left corner back to its original position 
            // The model matrix:   t2 * s * t1
            // t1 is the first operation to be applied, thus the closest to the point, 

		    var t1=translate(.6, .6, 0.0);
		    var s=scale4(.7, .7, 0.0);
		    var t2=translate(-.6, -.6, 0.0);

            modelViewMatrix = mult(mult(mult(modelViewMatrix, t2), s), t1);
		    break;

	    //Perform a scale up about the lower left corner of the white rectangle
	    case 'G':
		    var t1=translate(.6, .6, 0.0);
		    var s=scale4(1.2, 1.2, 0.0);
		    var t2=translate(-.6, -.6, 0.0);

            modelViewMatrix = mult(mult(mult(modelViewMatrix, t2), s), t1);
		    break;

	    //Push onto the matrix stack
	    case 'P':
		    modelViewStack.push(modelViewMatrix);
		    break;

	    //Pop from the matrix stack
	    case 'Q':
	 	    modelViewMatrix = modelViewStack.pop();	
		    break;
        }

        render();
    };


    render();
}

function initBuffers(gl) {
    //  Configure WebGL
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Prepare to send the model view matrix to the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    // Prepare to send the color index value to the fragment shader
    colorIndexLoc = gl.getUniformLocation(program, "colorIndex");
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

// draw the Two squares on the black background
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
   
    gl.uniform1i(colorIndexLoc, 1); // white
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mat4()));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    // model view maatrix effects the smaller square only
    gl.uniform1i(colorIndexLoc, 2); // cyan
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
}
