var canvas;
var gl;

var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

var numTimesToSubdivide = 5;

var pointsArray = [];
var normalsArray = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[.3, .6, .6];
var at=[.1, .1, 0];
var up=[0, 1, 0];

var cubeCount=36;
var sphereCount=0;


var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(.2, 1, 1, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

// var materialAmbient = vec4( .2, .2, .2, 1.0 );
// var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
// var materialSpecular = vec4( 1, 1, 1, 1.0 );

var materialAmbient = vec4( 0.184, 0.3098, 0.3098, 1.0);
var materialDiffuse = vec4( 0.184, 0.3098, 0.3098, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );

var materialShininess = 50.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // generate the points/normals
    colorCube();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    // pass data onto GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );

    // support user interface
    // document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    // document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    // document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    // document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    // document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    // document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
    case 37:  // left cursor key
              xrot -= deg;
              break;
    case 39:   // right cursor key
              xrot += deg;
              break;
    case 38:   // up cursor key
              yrot -= deg;
              break;
    case 40:    // down cursor key
              yrot += deg;
              break;
    }
}

// ******************************************
// Draw simple and primitive objects
// ******************************************
function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

// start drawing the wall
function DrawWall(thickness)
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(0.5, 0.5*thickness, 0.5);
	s=scale4(1.0, thickness, 1.0);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw composite objects
// ******************************************
function DrawJackPart()
{
	var s, t, r;

	// draw one axis of the unit jack - a stretched sphere
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(0.2, 0.2, 1.0);
        modelViewMatrix = mult(modelViewMatrix, s);
	DrawSolidSphere(1);
	modelViewMatrix=mvMatrixStack.pop();

	// ball on one end
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 1.2);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidSphere(0.2);

	// ball on the other end  -- notice there is no pop and push here
	t=translate(0, 0, -2.4);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawSolidSphere(0.2);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawJack()
{
 	var r;

	// draw a unit jack out of spheres
	mvMatrixStack.push(modelViewMatrix);
	DrawJackPart();

	r=rotate(90.0, 0, 1, 0);
        modelViewMatrix = mult(modelViewMatrix, r);
	DrawJackPart();
	modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90, 1, 0, 0);
        modelViewMatrix = mult(modelViewMatrix, r);
	DrawJackPart();
	modelViewMatrix=mvMatrixStack.pop();
}


function DrawTableLeg(thick, len)
{
	var s, t;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len/2, 0);
	var s=scale4(thick, len, thick);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTable(topWid, topThick, legThick, legLen)
{
	var s, t;

	// draw the table top
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();

	// place the four table legs
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);
	t= translate(dist, 0, dist);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

        // no push and pop between leg placements
	t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

	t=translate(-2*dist, 0, 2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

	t=translate(0, 0, -2*dist);
        modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawLadder(width, height) {
  // 0.02, 0.3
	mvMatrixStack.push(modelViewMatrix);
	t= translate(-width, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, t);

  DrawLadderSides(0.02, height);

  modelViewMatrix=mvMatrixStack.pop();

  DrawLadderSides(0.02, height);

  DrawLadderRungs(width, height)
}

function DrawLadderRungs(width, height) {
  var numRungs = height / 0.1;
  for (var i = 1; i < numRungs; i++) {
  	mvMatrixStack.push(modelViewMatrix);
  	t= translate(-width/2, -height/2 + (i * 0.1), 0);
    modelViewMatrix = mult(modelViewMatrix, t);

    DrawLadderRung(0.02, width, 0.01);

    modelViewMatrix=mvMatrixStack.pop();
  }
}

function DrawLadderRung(thickness, width, length) {
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0, 0);
	s=scale4(width, thickness, length);
    	modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawLadderSides(thickness, height) {
	var s, t;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, 0, 0);
	var s=scale4(thickness, height, thickness);
        modelViewMatrix=mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   	// set up view and projection
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
   	modelViewMatrix=lookAt(eye, at, up);
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawLadder(0.25, 1.25);

	// // draw jack// what makes the sphere appear on the same surface?
	// mvMatrixStack.push(modelViewMatrix);
	// t=translate(0.6, 0.45, 0.6);
	// r=rotate(45, 0, 0, 1);
	// s=scale4(0.1, 0.1, 0.1);
	// modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
	// DrawJack();
	// modelViewMatrix=mvMatrixStack.pop();
  //
	// // draw the sphere
	// mvMatrixStack.push(modelViewMatrix);
	// t=translate(0.25, 0.42,0.35);
	// modelViewMatrix=mult(modelViewMatrix, t);
	// DrawSolidSphere(0.1);
	// modelViewMatrix=mvMatrixStack.pop();
  //
	// // draw the table
	// mvMatrixStack.push(modelViewMatrix);
	// t=translate(0.4, 0, 0.4);
  //       modelViewMatrix=mult(modelViewMatrix, t);
	// DrawTable(0.6, 0.02, 0.02, 0.3);
	// modelViewMatrix=mvMatrixStack.pop();
  //
	// // wall # 1: in xz-plane
	// DrawWall(0.02);
  //
	// // wall #2: in yz-plane
	// mvMatrixStack.push(modelViewMatrix);
	// r=rotate(90.0, 0.0, 0.0, 1.0);
  //       modelViewMatrix=mult(modelViewMatrix, r);
	// DrawWall(0.02);
	// modelViewMatrix=mvMatrixStack.pop();
  //
	// // wall #3: in xy-plane
	// mvMatrixStack.push(modelViewMatrix);
	// r=rotate(-90, 1.0, 0.0, 0.0);
	// //r=rotate(90, 1.0, 0.0, 0.0);  // ??
  //       modelViewMatrix=mult(modelViewMatrix, r);
	// DrawWall(0.02);
	// modelViewMatrix=mvMatrixStack.pop();

    // requestAnimFrame(render);
}

// ******************************************
// supporting functions below this:
// ******************************************
function triangle(a, b, c)
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     sphereCount += 3;
}

function divideTriangle(a, b, c, count)
{
    if ( count > 0 )
    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n)
{
    	divideTriangle(a, b, c, n);
    	divideTriangle(d, c, b, n);
    	divideTriangle(a, d, b, n);
    	divideTriangle(a, c, d, n);
}

function quad(a, b, c, d)
{
     	var t1 = subtract(vertices[b], vertices[a]);
     	var t2 = subtract(vertices[c], vertices[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[b]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[d]);
     	normalsArray.push(normal);
}

function colorCube()
{
    	quad( 1, 0, 3, 2 ); //top
    	quad( 2, 3, 7, 6 ); //right
    	quad( 3, 0, 4, 7 ); //
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}
