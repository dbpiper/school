var canvas;
var gl;

var eye=[1, 2, 2];
var at = [0, 0, 0];
var up = [0, 1, 0];

var numVertices  = 0;

var pointsArray = [];
var normalsArray = [];

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
  var height = 1;
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

function DrawCastle() {
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
}

// triangle has 3 points per call
// quad has 6 points per call
// pentagon has 9 points per call
function DrawTower(vertices) {
    quad(0, 1, 2, 3, vertices); // front - ABCD
    quad(4, 5, 1, 0, vertices); // right - EFBA
    quad(3, 2, 7, 6, vertices); // left - DCHG
    quad(6, 7, 5, 4, vertices); // back - GHFE
    quad(4, 0, 3, 6, vertices); // bottom - EADG
    triangle(1, 8, 2, vertices); // front of top tip - BIC
    triangle(5, 8, 1, vertices); // right of the top tip - FIB
    triangle(2, 8, 7, vertices); // left of the top tip - CIH
    triangle(7, 8, 5, vertices); // back of the top tip - HIF
}

// quad has 6 points per call
// pentagon has 9 points per call
function DrawBarn()
{
    quad(0, 5, 9, 4);   // AFJE left side
    quad(3, 4, 9, 8);   // DEJI left roof
    quad(2, 3, 8, 7);  // right roof
    quad(1, 2, 7, 6); // right side
    quad(0, 1, 6, 5); // bottom
    pentagon (5, 6, 7, 8, 9);  // FGHIJ back
    pentagon (0, 4, 3, 2, 1);  // ABCDE (clockwise) front
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

// 3 points per call
function triangle(a, b, c, vertices) {

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

     numVertices += 3;
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

     numVertices += 6;
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
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // DrawBarn();
    DrawCastle();

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

    thetaLoc = gl.getUniformLocation(program, "theta");

    viewerPos = vec3(4.0, 4.0, 4.0 );

    projection = ortho(-2, 2, -2, 2, -20, 20);

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

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    render();
}

var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    requestAnimFrame(render);
}
