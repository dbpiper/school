var canvas;
var gl;
var texCoordsArray = [];

var r = 20;
var zoom = 2;
var lr = 120;
var ud = 30;

// texture coordinates
var texCoord = [
    vec2(0, .2),
    vec2(0, 0),
    vec2(.2, .2),
    vec2(.2, 0),
];

var texture1, texture2;


var animate = false;

var animateMoveBatteringRam = {
  moveForward: 0,
  numSteps: 100,
  currentStep: 0,
};

var animateRam = {
  times: 0,
  moveAmount: 0,
  numSteps: 100,
  currentStep: 0,
  moveForward: false,
};


var eye=[1, 2, 2];
var at = [0, 0, 0];
var up = [0, 1, 0];

var numPointsCastle  = 0;
var numPointsCube = 36;
var numPointsCylinder = 0;
var numPointsCone = 0;

var modelViewMatrix, projectionMatrix;
modelViewMatrix = mat4();
var modelViewMatrixLoc, projectionMatrixLoc;

var pointsArray = [];
var normalsArray = [];
var mvMatrixStack=[];

var cubeVertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];
// var vertices = [
//         vec4(0, 0, 0, 1),   // A(0)
//         vec4(1, 0, 0, 1),   // B(1)
//         vec4(1, 1, 0, 1),   // C(2)
//         vec4(0.5, 1.5, 0, 1), // D(3)
//         vec4(0, 1, 0, 1),    // E(4)
//         vec4(0, 0, 1, 1),    // F(5)
//         vec4(1, 0, 1, 1),    // G(6)
//         vec4(1, 1, 1, 1),    // H(7)
//         vec4(0.5, 1.5, 1, 1),  // I(8)
//         vec4(0, 1, 1, 1)     // J(9)
//     ];

var leftFrontTowerVertices = [];
var rightFrontTowerVertices = [];
var leftBackTowerVertices = [];
var rightBackTowerVertices = [];

var frontWallVertices = [];
var rightWallVertices = [];
var leftWallVertices = [];
var backWallVertices = [];

SetVertices();

function SetVertices() {
  var wallTopHeight = 0.25;
  SetTowerVertices([0, 0, 0], 1.5);
  SetFrontWallVertices(wallTopHeight);
  SetRightWallVertices(wallTopHeight);
  SetLeftWallVertices(wallTopHeight);
  SetBackWallVertices(wallTopHeight);
}

function MakeWallTopVector(vector, wallTopHeight) {
    newVector = [];
    var len = vector.length;
    for (var i = 0; i < len; i++) {
      newVector.push(vector[i]);
    }

    newVector[1] -= wallTopHeight;
    return newVector;
}

function SetFrontWallVertices(wallTopHeight) {
  frontWallVertices = [
    rightFrontTowerVertices[3], // A(0) -- right tower's D(3)
    MakeWallTopVector(rightFrontTowerVertices[2], wallTopHeight), // B(1) -- right tower's C(2)
    MakeWallTopVector(leftFrontTowerVertices[1], wallTopHeight), // C(2) -- left tower's B(1)
    leftFrontTowerVertices[0], // D(3) -- left tower's A(0)
  ];
}

function SetRightWallVertices(wallTopHeight) {
  rightWallVertices = [
    rightBackTowerVertices[0], // A(0) -- back tower's A(0)
    MakeWallTopVector(rightBackTowerVertices[1], wallTopHeight), // B(1) -- back tower's B(1)
    MakeWallTopVector(rightFrontTowerVertices[5], wallTopHeight), // C(2) -- front tower's F(5)
    rightFrontTowerVertices[4], // D(3) -- front tower's E(4)
  ];
}

function SetLeftWallVertices(wallTopHeight) {
  leftWallVertices = [
    leftFrontTowerVertices[6], // A(0) -- front tower's G(6)
    MakeWallTopVector(leftFrontTowerVertices[7], wallTopHeight), // B(1) -- front tower's H(7)
    MakeWallTopVector(leftBackTowerVertices[2], wallTopHeight), // C(2) -- back tower's C(2)
    leftBackTowerVertices[3], // D(3) -- back tower's D(3)
  ];
}

function SetBackWallVertices(wallTopHeight) {
  backWallVertices = [
    leftBackTowerVertices[4], // A(0) -- left tower's E(4)
    MakeWallTopVector(leftBackTowerVertices[5], wallTopHeight), // B(1) -- left tower's F(5)
    MakeWallTopVector(rightBackTowerVertices[7], wallTopHeight), // C(2) -- right tower's H(7)
    rightBackTowerVertices[6], // D(3) -- right tower's G(6)
  ];
}

// Generates the vertices programatically
// to allow easy resizing of the shapes
function SetTowerVertices(centerPosition, wallWidth) {
  var width = 0.5
  var thickness = 0.5;
  var height = 1.25;
  var topHeight = 0.25;

  var centerX = centerPosition[0];
  var centerY = centerPosition[1];
  var centerZ = centerPosition[2];


  // leftFrontTowerVertices = GenerateVerticesTower(width, thickness, height,
  //   topHeight, [-1, 0, 0.25]);
  // rightFrontTowerVertices = GenerateVerticesTower(width, thickness, height,
  //   topHeight, [0.25, 0, 0.25]);
  // leftBackTowerVertices = GenerateVerticesTower(width, thickness, height,
  //   topHeight, [-1, 0, -0.75]);
  // rightBackTowerVertices = GenerateVerticesTower(width, thickness, height,
  //   topHeight, [0.25, 0, -0.75]);

  leftFrontTowerVertices = GenerateVerticesTower(width, thickness, height,
    topHeight,
    [centerX - (wallWidth / 2), centerY, centerZ + (wallWidth / 2)]
  );
  rightFrontTowerVertices = GenerateVerticesTower(width, thickness, height,
    topHeight,
    [centerX + (wallWidth / 2), centerY, centerZ + (wallWidth / 2)]
  );
  leftBackTowerVertices = GenerateVerticesTower(width, thickness, height,
    topHeight,
    [centerX - (wallWidth / 2), centerY, centerZ - (wallWidth / 2)]
  );
  rightBackTowerVertices = GenerateVerticesTower(width, thickness, height,
    topHeight,
    [centerX + (wallWidth / 2), centerY, centerZ - (wallWidth / 2)]
  );
}

// Generates the vertices programatically
// to allow easy resizing of the shapes
function GenerateVerticesTower(width, thickness, height, topHeight, startPoint) {
  var startX = startPoint[0];
  var startY = startPoint[1];
  var startZ = startPoint[2];
  // var topHeight = 0.25;
  var verts = [
    vec4(startX, startY, startZ, 1), // A(0) (front-bottom-right)
    vec4(startX, startY + height, startZ, 1), // B(1) (front-top-right)
    vec4(startX - width, startY + height, startZ, 1), // C(2) (front-top-left)
    vec4(startX - width, startY, startZ, 1), // D(3) (front-bottom-left)
    vec4(startX, startY, startZ - thickness, 1), // E(4) (right side - bottom - right)
    vec4(startX, startY + height, startZ - thickness, 1), // F(5) (right side - top - right)
    vec4(startX - width, startY, startZ - thickness, 1), // G(6) (left side - bottom - left)
    vec4(startX - width, startY + height, startZ - thickness, 1), // H(7) (left side - top - left)
    vec4(startX - (width/2), startY + (height + topHeight), startZ - (thickness/2), 1), // I(8) (top point above)
  ];
  return verts;
}

// Generates the vertices programatically
// to allow easy resizing of the shapes
function GenerateVertices() {
  var verts = [];
  return GenerateVerticesTower(0.5, 0.5, 1, 0.25, [-1, 0, 0]);
}

function GenerateCastle() {
  DrawTowers();
  DrawWalls();
}

function DrawTowers() {
  DrawTower(leftFrontTowerVertices);
  DrawTower(rightFrontTowerVertices);
  DrawTower(leftBackTowerVertices);
  DrawTower(rightBackTowerVertices);
}

function DrawWalls() {
  DrawWall(frontWallVertices);
  DrawWall(rightWallVertices);
  DrawWall(leftWallVertices);
  DrawWall(backWallVertices);
}

function DrawWall(vertices)  {
  quad(0, 1, 2, 3, vertices);
  numPointsCastle += 6;
}

// triangle has 3 points per call
// quad has 6 points per call
// pentagon has 9 points per call
function DrawTower(vertices) {
    quad(0, 1, 2, 3, vertices); // front - ABCD
    numPointsCastle += 6;
    quad(4, 5, 1, 0, vertices); // right - EFBA
    numPointsCastle += 6;
    quad(3, 2, 7, 6, vertices); // left - DCHG
    numPointsCastle += 6;
    quad(6, 7, 5, 4, vertices); // back - GHFE
    numPointsCastle += 6;
    quad(4, 0, 3, 6, vertices); // bottom - EADG
    numPointsCastle += 6;
    triangle(1, 8, 2, vertices); // front of top tip - BIC
    numPointsCastle += 3;
    triangle(5, 8, 1, vertices); // right of the top tip - FIB
    numPointsCastle += 3;
    triangle(2, 8, 7, vertices); // left of the top tip - CIH
    numPointsCastle += 3;
    triangle(7, 8, 5, vertices); // back of the top tip - HIF
    numPointsCastle += 3;
}

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays( gl.TRIANGLES, 0, numPointsCube);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawLadder(width, height) {
  // 0.02, 0.3
	mvMatrixStack.push(modelViewMatrix);
	var t = translate(-width, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, t);

  DrawLadderSides(0.02, height);

  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);

  DrawLadderSides(0.02, height);

  DrawLadderRungs(width, height)

  modelViewMatrix=mvMatrixStack.pop();
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

var lightPosition = vec4(1.8, 1., 2, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.75, 0.1, 0.1, 1.0 );
var materialDiffuse = vec4( 0.75, 0.1, 0.1, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 40.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var thetaLoc;

var flag = false;

// a, b, c, and d are all vec4 type
function triangleAbsolute(a, b, c)
{
	/*
    var t1 = subtract(b, a);
   	var t2 = subtract(c, a);
   	var normal = cross(t1, t2);
   	var normal = vec4(normal);
   	normal = normalize(normal);
   	*/
	var points=[a, b, c];
   	var normal = NewellAbsolute(points);

    // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

   	pointsArray.push(b);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);


   	pointsArray.push(c);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);
}

// a, b, c, and d are all vec4 type
function quadAbsolute(a, b, c, d)
{
    /*
    var t1 = subtract(b, a);
   	var t2 = subtract(c, a);
   	var normal = cross(t1, t2);
   	var normal = vec4(normal);
   	normal = normalize(normal);
   	*/

	var points=[a, b, c, d];
   	var normal = NewellAbsolute(points);

    // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

   	pointsArray.push(b);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

   	pointsArray.push(c);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);


    // triangle acd
   	pointsArray.push(a);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

   	pointsArray.push(c);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

   	pointsArray.push(d);
   	normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);
}
// 3 points per call
function triangle(a, b, c, vertices) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);
}

// 6 points per call
function quad(a, b, c, d, vertices) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]);
}

// 9 points per call
function pentagon(a, b, c, d, e) {

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

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     pointsArray.push(vertices[e]);
     normalsArray.push(normal);
}

function GenerateCone(radius, height, stacks, slices)
{
    var hypotenuse=Math.sqrt(height*height + radius*radius);
	var cosTheta = radius/hypotenuse;
	var sinTheta = height/hypotenuse;

    // starting out with a single line in xy-plane
	var line=[];
	for (var p=0; p<=stacks; p++)  {
	    line.push(vec4(p*hypotenuse/stacks*cosTheta, p*hypotenuse/stacks*sinTheta, 0, 1));
    }

    prev = line;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=1; i<=slices; i++) {
        var curr=[]

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // triangle bottom of the cone
        triangleAbsolute(prev[0], curr[1], prev[1]);
        numPointsCone += 3;

        // create the triangles for this slice
        for (var j=1; j<stacks; j++) {
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];

            quadAbsolute(prev1, curr1, curr2, prev2);
            numPointsCone += 6;
        }

        prev = curr;
    }
}

function GenerateCylinder()
{
    var height=1;
    var radius=1;
    var num=50;
    var alpha=(2*Math.PI)/num;

    vertices = [vec4(0, 0, 0, 1)];
    for (var i=num; i>=0; i--)
    {
        vertices.push(vec4(radius*Math.cos(i*alpha), 0, radius*Math.sin(i*alpha), 1));
    }

    numQuads = vertices.length;

    // add the second set of points
    for (var i=0; i < numQuads; i++)
    {
        vertices.push(vec4(vertices[i][0], vertices[i][1]+height, vertices[i][2], 1));
    }

    ExtrudedShape(numQuads, vertices);
}

function ExtrudedShape(numQuads, vertices)
{
    var basePoints=[];
    var topPoints=[];

    // create the face list
    // add the side faces first --> N quads
    for (var j=0; j<numQuads; j++)
    {
        quad(j, j+numQuads, (j+1)%numQuads+numQuads, (j+1)%numQuads, vertices);
        numPointsCylinder += 6;
    }

    // the first N vertices come from the base
    basePoints.push(0);
    for (var i = numQuads - 1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    numPointsCylinder += polygon(basePoints, vertices);

    // the next N vertices come from the top
    for (var i=0; i < numQuads; i++)
    {
        topPoints.push(i + numQuads); // index only
    }
    // add the top face
    numPointsCylinder += polygon(topPoints, vertices);
}

function polygon(indices, vertices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices, vertices);

    var numPoints = 0;
    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
        numPoints += 3;
    }

    return numPoints;
}

function Newell(indices, vertices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        console.log(key);
        switch (key) { // only works for basic characters
          case 'a':
          case 'A':
            animate = !animate;
            var audio = new Audio('wheels.mp3');
            audio.play();
            break;
        }
        switch (event.keyCode) {
            case 37: // left arrow
                lr += 18;
                break;
            case 38: // up arrow
                if (ud < 81)
                    ud += 9;
                break;
            case 39: // right arrow
                lr -= 18;
                break;
            case 40: // down arrow
                if (ud > 9)
                    ud -= 9;
                break;
        }
    }
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();


    // DrawBarn();
    GenerateCastle();

    GenerateCylinder();
    GenerateCone(0.4, 1, 8, 12);  // size: ((stacks-1)*6+3)*slices=540,

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // set up texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );



    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    thetaLoc = gl.getUniformLocation(program, "theta");

    viewerPos = vec3(4.0, 4.0, 4.0 );

    //projectionMatrix = ortho(-2, 2, -2, 2, -20, 20);
    projectionMatrix = ortho(-zoom, zoom, -zoom, zoom, -1000, 1000);
    // projectionMatrix = ortho(-1, 0.6, -1, 0.6, -10, 10);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

    gl.uniformMatrix4fv(projectionMatrixLoc,
       false, flatten(projectionMatrix));

    EstablishTextures();

    render();
}

var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    var eye = vec3(
          r * Math.cos(ud/180 * Math.PI) * Math.cos(lr/180 * Math.PI),
          r * Math.sin(ud/180 * Math.PI),
          r * Math.cos(ud/180 * Math.PI) * Math.sin(lr/180 * Math.PI)
    );
    console.log(eye);
    modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0] ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0] ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1] ));

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

    PositionCastle();
    if (animate &&
      animateMoveBatteringRam.currentStep < animateMoveBatteringRam.numSteps) {
      var stepSize = 0.5/100;
      animateMoveBatteringRam.moveForward += stepSize;
      animateMoveBatteringRam.currentStep++;
      // time to move ram
    } else if (animate &&
      animateMoveBatteringRam.currentStep >= animateMoveBatteringRam.numSteps) {
      // swing back
      if (animateRam.currentStep >= animateRam.numSteps) {
        animateRam.currentStep = 0;
        animateRam.moveForward = !animateRam.moveForward;
        animateRam.times++;
      }
      var stepSize = 0.5/100;
      // move back for initial swing
      if (animateRam.times == 0) {
        stepSize = 0.25/100;
      }
      if (animateRam.moveForward) {
        animateRam.moveAmount -= stepSize;
      } else {
        animateRam.moveAmount += stepSize;
      }
      animateRam.currentStep++;
    }

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    PositionBatteringRam(animateMoveBatteringRam.moveForward,
      animateRam.moveAmount);
    PositionCatapult();

    requestAnimFrame(render);
}

function loadTexture(texture, whichTexture)
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // version 1 (combination needed for images that are not powers of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // version 2
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);

    // set the texture parameters
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // mipmap option (only if the image is of power of 2 dimension)
    //gl.generateMipmap( gl.TEXTURE_2D );
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);
}

function EstablishTextures()
{
    // ========  Establish Textures =================
    // --------create texture object 1----------
    texture1 = gl.createTexture();

    // create the image object
    texture1.image = new Image();
	//texture1.image.crossOrigin = "anonymous";

    // Tell the broswer to load an image
    texture1.image.src='wood.jpg';

    // register the event handler to be called on loading an image
    texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

    // -------create texture object 2------------
    texture2 = gl.createTexture();

    // create the image object
    texture2.image = new Image();
	//texture2.image.crossOrigin = "anonymous";

    // Tell the broswer to load an image
    texture2.image.src='stone.jpg';


    // register the event handler to be called on loading an image
    texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }
}

function PositionCatapult() {
    mvMatrixStack.push(modelViewMatrix);
    var t = translate(-0.2, 0, 1.5);
    // var s = scale4(scale, scale, scale );   // scale to the given width/height/depth
    modelViewMatrix = mult(modelViewMatrix, t);
    // modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    DrawCatapult(0.3, 0.5, 0.5);

  	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCatapult(width, height, depth) {
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 139/255, 69/255, 19/255, 1.0);
    materialSpecular = vec4( 139/255, 69/255, 19/255, 1.0 );
    materialShiness=50;
    SetupLightingMaterial();

    mvMatrixStack.push(modelViewMatrix);

    DrawCatapultBase(width, height, depth);
    DrawCatapultMid(width, height, depth);
    DrawCatapultTop(width, height, depth);

  	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCatapultTop(width, height, depth) {
  var thickness = width/5;
	mvMatrixStack.push(modelViewMatrix);

	var t = translate(width/2.5, height-thickness/2, -depth/2);
	var s = scale4(thickness, height/5, depth/1.5);
  var m = mult(t, s);
  var t2 = translate(0, 0, depth/4);
  var m = mult(t2, m);
  // modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  modelViewMatrix = mult(modelViewMatrix, m);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);

	var t = translate(width/2.5, height-thickness/2, -depth/2);
  var t2 = translate(0, -height/2 + thickness, depth/1.3);
  var m = mult(t2, t);
  // modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  modelViewMatrix = mult(modelViewMatrix, m);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawCone(height/2);

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawCatapultMid(width, height, depth) {
  var thickness = width/5;
	mvMatrixStack.push(modelViewMatrix);

	var t = translate(width/2.5, height/2, -depth/2);
	var s = scale4(thickness, height, thickness);
  var m = mult(t, s);
  // modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  modelViewMatrix = mult(modelViewMatrix, m);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

}

function DrawCatapultBase(width, height, depth) {

  var thickness = width/5;
  var height = height/5;
	mvMatrixStack.push(modelViewMatrix);

	var t = translate(0, 0, 0);
	var s = scale4(thickness, height, depth-thickness);
  var m = mult(t, s);
  // modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  modelViewMatrix = mult(modelViewMatrix, m);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);

	var t = translate(width-thickness, 0, 0);
	var s = scale4(thickness, height, depth-thickness);
  var m = mult(t, s);
  // modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  modelViewMatrix = mult(modelViewMatrix, m);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);

	var t = translate(width/2.5, 0, -depth/2);
	var s = scale4(width, height, thickness);
  var m = mult(t, s);
  // modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  modelViewMatrix = mult(modelViewMatrix, m);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();
}

function PositionBatteringRam(moveForward, ramMoveAmount) {
    mvMatrixStack.push(modelViewMatrix);
    var t = translate(-0.75, 0, 1 - moveForward);
    // var s = scale4(scale, scale, scale );   // scale to the given width/height/depth
    modelViewMatrix = mult(modelViewMatrix, t);
    // modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    DrawBatteringRam(0.3, 0.5, 0.5, ramMoveAmount);

  	modelViewMatrix=mvMatrixStack.pop();
}

function DrawBatteringRam(width, height, depth, ramMoveAmount) {

    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 139/255, 69/255, 19/255, 1.0);
    materialSpecular = vec4( 139/255, 69/255, 19/255, 1.0 );
    materialShiness=50;
    SetupLightingMaterial();

    DrawBatteringRamFrame(width, height, depth);

    mvMatrixStack.push(modelViewMatrix);
    var t = translate(0, 0, ramMoveAmount);
    // var s = scale4(scale, scale, scale );   // scale to the given width/height/depth
    modelViewMatrix = mult(modelViewMatrix, t);
    // modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    DrawRam(width, height, depth);

  	modelViewMatrix=mvMatrixStack.pop();

    DrawWheel(width, depth/7);

    mvMatrixStack.push(modelViewMatrix);
    var t = translate(0, 0, -depth);
    var s = scale4(scale, scale, scale );   // scale to the given width/height/depth
    modelViewMatrix = mult(modelViewMatrix, t);
    // modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    DrawWheel(width, depth/7);

  	modelViewMatrix=mvMatrixStack.pop();
}

function DrawPosts(width, height, depth) {
  var thickness = width/5;
  var height = height;
	mvMatrixStack.push(modelViewMatrix);

	var t = translate(-width/10, height/2, 0);
	var s = scale4(thickness, height, thickness);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

	mvMatrixStack.push(modelViewMatrix);

  var t = translate(-width/10, height/2, -depth);
	var s = scale4(thickness, height, thickness);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawBatteringRamTopPost(width, height, depth) {
  var thickness = width;
	mvMatrixStack.push(modelViewMatrix);

	var t = translate(-width/2, height, 0);
	var s = scale4(width, height/10, width/5);
  var r = rotate(90, 0, 0, 1);
  var ts = mult(t, s);
  var m = mult(ts, t);
  modelViewMatrix=mult(modelViewMatrix, ts);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();

}

function DrawBatteringRamConnectionPost(width, height, depth) {
	mvMatrixStack.push(modelViewMatrix);

	var t = translate(-width/2, height, -depth/2);
	var s = scale4(width/5, height/10, depth);
  var r = rotate(90, 0, 0, 1);
  var ts = mult(t, s);
  var m = mult(ts, t);
  modelViewMatrix=mult(modelViewMatrix, ts);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawSolidCube(1);

  modelViewMatrix=mvMatrixStack.pop();
}

function DrawRam(width, height, depth) {
	mvMatrixStack.push(modelViewMatrix);
  var t = translate(depth/2, height/2, -width/2);
	var s = scale4(2, 1, 1);   // scale to the given width/height/depth
  // var r1 = rotate(90, 1, 0, 0);
  // var r2 = rotate(90, 0, 0, 1);
  var r = rotate(90, 0, 1, 0);
  var rs = mult(r, s);
  var m = mult(rs, t);
  modelViewMatrix = mult(modelViewMatrix, m);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawWheel(width, depth/7);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawBatteringRamTopPosts(width, height, depth) {
  DrawBatteringRamTopPost(width, height, depth);

	mvMatrixStack.push(modelViewMatrix);

  var t = translate(0, 0, -depth);
	// var s = scale4(thickness, height, thickness);
  modelViewMatrix=mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawBatteringRamTopPost(width, height, depth);

	modelViewMatrix=mvMatrixStack.pop();

}

function DrawBatteringRamFrame(width, height, depth) {
  DrawPosts(width, height, depth);
  DrawBatteringRamTopPosts(width, height, depth);
  DrawBatteringRamConnectionPost(width, height, depth);

  mvMatrixStack.push(modelViewMatrix);

	var t = translate(-width + width/5, 0, 0);
	// var s = scale4(thickness, height, thickness);
  modelViewMatrix=mult(modelViewMatrix, t);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawPosts(width, height, depth);

  modelViewMatrix=mvMatrixStack.pop();

}

function PositionCastle() {
  	mvMatrixStack.push(modelViewMatrix);
    var t = translate(-0.1, 0, -0.8);
    var s = scale4(scale, scale, scale );   // scale to the given width/height/depth
    modelViewMatrix = mult(modelViewMatrix, t);
    // modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    PositionLadder(1);

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

    DrawCastle(0.75);

  	modelViewMatrix=mvMatrixStack.pop();
}

function DrawWheel(length, scale) {
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 139/255, 69/255, 19/255, 1.0);
  materialSpecular = vec4( 139/255, 69/255, 19/255, 1.0 );
  materialShiness=50;
  SetupLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	var s = scale4(scale, length, scale);   // scale to the given width/height/depth
  var r1 = rotate(90, 1, 0, 0);
  var r2 = rotate(90, 0, 0, 1);
  var r = mult(r1, r2);
  var m = mult(r, s);
  modelViewMatrix = mult(modelViewMatrix, m);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  DrawCylinder(1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCone(scale) {
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(scale, scale, scale);   // scale to the given width/height/depth
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays( gl.TRIANGLES, numPointsCube + numPointsCastle + numPointsCylinder,
    numPointsCone );

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCylinder(length) {
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays( gl.TRIANGLES, numPointsCube + numPointsCastle, numPointsCylinder );

	modelViewMatrix=mvMatrixStack.pop();
}

function PositionLadder(scale) {
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 139/255, 69/255, 19/255, 1.0);
    materialSpecular = vec4( 139/255, 69/255, 19/255, 1.0 );
    materialShiness=50;
    SetupLightingMaterial();

  	mvMatrixStack.push(modelViewMatrix);
    //var t = translate(-0.1, 1.25/2, 0.8);
    var t = translate(0, 1/2, 0.6);
    var r1 = rotate(180, [0, 1, 0] );
    var r2 = rotate(0, [1, 0, 0] );
    var r = mult(r1, r2);
    var m = mult(t, r);
    var s = scale4(scale, scale, scale );   // scale to the given width/height/depth
    modelViewMatrix = mult(modelViewMatrix, m);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    DrawLadder(0.15, 1);

  	modelViewMatrix=mvMatrixStack.pop();
}

function DrawCastle(length) {
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 105/255, 105/255, 105/255, 1.0);
  materialSpecular = vec4( 105/255, 105/255, 105/255, 1.0 );
  materialShiness=50;
  SetupLightingMaterial();

	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  gl.drawArrays( gl.TRIANGLES, numPointsCube, numPointsCastle );

	modelViewMatrix=mvMatrixStack.pop();
}

function colorCube()
{
    	quad( 1, 0, 3, 2, cubeVertices); //top
    	quad( 2, 3, 7, 6, cubeVertices); //right
    	quad( 3, 0, 4, 7, cubeVertices); //
    	quad( 6, 5, 1, 2, cubeVertices);
    	quad( 4, 5, 6, 7, cubeVertices);
    	quad( 5, 4, 0, 1, cubeVertices);
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function SetupLightingMaterial()
{
    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	// send lighting and material coefficient products to GPU
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}

function NewellAbsolute(vertices)
{
   var L=vertices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=i;
       nextIndex = (i+1)%L;

       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}
