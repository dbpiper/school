var gl, program;
var modelViewStack=[];
var modelViewMatrix;
var vertices;

function main()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    initBuffers();
    
    render();
};

function initBuffers() {

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Prepare to send the model view matrix to the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function normalizePoint(point, largestX, largestY, smallestX, smallestY)
{
    var x = (point[0] - smallestX)/(largestX - smallestX)  * 2 - 1;
    var y = (point[1] - smallestY)/(largestY - smallestY)  * 2 - 1;

    return vec2(x, y);
}

function normalizePoints(points)
{
   var largestX = 0;
   var largestY = 0;
   var smallestX = 1000000;
   var smallestY = 1000000;

   var newPoints = [];
   var len = points.length;
   for (var i = 0; i < len; i++) {
       var point = points[i];
        if (point[0] > largestX) {
            largestX = point[0];
        }
        if (point[0] < smallestX) { 
            smallestX = point[0];
        }
        if (point[1] > largestY) {
            largestY = point[1];
        }
        if (point[1] < smallestY) {
            smallestY = point[1];
        }
   }

   for (var i = 0; i < len; i++) {
        newPoints.push(ormalizePoint(points[i], largestX, largestY, 
                smallestX, smallestY));
   }

   return newPoints;
}

function GeneratePoints()
{
    var vertices=[];

	//snowflake
	/*
	vertices.push(vec2(0, 0.1));
    vertices.push(vec2(2, 0.1));
    vertices.push(vec2(3, 1.5));
    vertices.push(vec2(3.2, 1.4));
    vertices.push(vec2(2, 0.1));
    vertices.push(vec2(2.1, 0.1));
    vertices.push(vec2(4, 0.1));
    vertices.push(vec2(5, 1.4));
    vertices.push(vec2(5.2, 1.4));
    vertices.push(vec2(4.1, 0.1));
    vertices.push(vec2(5.5, 0.1));
    vertices.push(vec2(5.8, 0));
	*/
	
	// wreath

    
    vertices.push(vec2(0, 2));
    vertices.push(vec2(0.1,1));
    vertices.push(vec2(0.4, 1));
    vertices.push(vec2(0, 4));
    vertices.push(vec2(-1, -0.3));
    vertices.push(vec2(-0.5, -0.5));
    
	
    //vertices = normalizePoints(vertices);

    return vertices;
}

function DrawWreath()
{
    var radius = 0.5;
    for (var i = 0; i < 13; i++) {
        var theta = (30 * i) * Math.PI / 180;
        var x = radius * Math.cos(theta);
        var y = radius * Math.sin(theta);
        var t = translate(x, y, 0);
         if (modelViewMatrix) {
            modelViewMatrix = mult(modelViewMatrix, t) ;
         } else {
            modelViewMatrix = t;
         }
        modelViewStack.push(modelViewMatrix);
        DrawOneStarTranslate(x, y);
        modelViewMatrix = modelViewStack.pop();
    }

}

function DrawOneStarTranslate(x, y)
{
    // draw the full star
    for (var i=1; i <= 5; i++) {
         t = translate(x, y, 0);
         r = rotate(72*i, 0, 0, 1);
         if (modelViewMatrix) {
            modelViewMatrix = mult(r, modelViewMatrix) ;
         } else {
            modelViewMatrix = r;
         }
         modelViewMatrix = mult(t, r);
         DrawOneBranch();
         
    }
}
function DrawOneStar()
{
    // draw the full star
    for (var i=1; i <= 5; i++) {
         r = rotate(72*i, 0, 0, 1);
         if (modelViewMatrix) {
            modelViewMatrix = mult(r, modelViewMatrix) ;
         } else {
            modelViewMatrix = r;
         }
         modelViewMatrix = r;
         DrawOneBranch();
         
    }
}

function DrawOneBranch()
{
    var s;

    // one branch
    s = scale4(1/16, 1/16, 1); 
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 0, vertices.length);

    /*
    modelViewMatrix = modelViewStack.pop();
    //s = scale4(1/8, -1/8, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 0, vertices.length);
    */
}

function render() {
  
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    var r;
    DrawWreath();
}
