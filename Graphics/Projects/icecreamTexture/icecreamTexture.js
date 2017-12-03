// global program control
var program
var canvas;
var gl;

// data
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

// texture coordinates
var texCoord = [
    vec2(0, .2),
    vec2(0, 0),
    vec2(.2, .2),
    vec2(.2, 0),
];

var texture1, texture2;

// ortho
var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var zoomFactor = .8;
var translateFactorX = 0.2;
var translateFactorY = 0.2;

// lookat
var eye;
var at=[0, 0, 0];
var up=[0, 1, 0];

// eye location
var theta=0;   // up-down angle
var phi=90;     // side-left-right angle
var Radius=1.5;

// key control
var deg=5;
var xrot=0;
var yrot=0;

// light and material
var lightPosition = vec4(1, 1, 1, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 0, 0, 1, 1.0 );
var materialShininess = 50.0;

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

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points/normals
	GeneratePrimitives();

	SendData();

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    SetupLightingMaterial();

    SetupUserInterface();

    EstablishTextures();

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    render();
}

function SendData()
{
    // pass data onto shaders
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

   // set up texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
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

function SetupUserInterface()
{
    // support user interface
    document.getElementById("phiPlus").onclick=function(){phi += deg;};
    document.getElementById("phiMinus").onclick=function(){phi-= deg;};
    document.getElementById("thetaPlus").onclick=function(){theta+= deg;};
    document.getElementById("thetaMinus").onclick=function(){theta-= deg;};
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};
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
    }
}

function GeneratePrimitives()
{
    GenerateCube();   // always called first, points: 0 - 35, size: 36

	slices=24;
	stacks=16;// radius(0.8), slices (12), stack(8)
	radius=0.8;
	// size: ((stacks-2)*6+2*3)*slices=504, points: 36 - 539
    GenerateSphere(radius, slices, stacks);

	radius=0.4;
	height=1;
    GenerateCone(radius, height);  // size: ((stacks-1)*6+3)*slices=540,
}

function GenerateCube()
{
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

    quad( vertices[1], vertices[0], vertices[3], vertices[2] );
    quad( vertices[2], vertices[3], vertices[7], vertices[6] );
    quad( vertices[3], vertices[0], vertices[4], vertices[7] );
    quad( vertices[6], vertices[5], vertices[1], vertices[2] );
    quad( vertices[4], vertices[5], vertices[6], vertices[7] );
    quad( vertices[5], vertices[4], vertices[0], vertices[1] );
}

function GenerateSphere(radius, slices, stacks)
{
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;

    var prev, curr;
    var curr1, curr2, prev1, prev2;

    var half=[];
	var count=0;
    // generate half circle: PI/2 (0) --> -PI/2 (stack)
    for (var phi=Math.PI/2; phi>=-Math.PI/2; phi-=stackInc) {
       half.push(vec4(radius*Math.cos(phi), radius*Math.sin(phi), 0, 1));
    }

    prev = half;
    // rotate around y axis
    var m=rotate(360/slices, 0, 1, 0);
    for (var i=1; i<=slices; i++) {
        var curr=[]

        // compute the new set of points with one rotation
        for (var j=0; j<=stacks; j++) {
            var v4 = multiply(m, prev[j]);
            curr.push( v4 );
        }

        // top of the sphere j=0 case
        triangle(prev[0], prev[1], curr[1]);

        // create the triangles for this slice
        for (var j=1; j<stacks-1; j++) {
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];

            quad(prev1, curr1, curr2, prev2);
        }

        // bottom of the sphere j=stacks case
        triangle(prev[stacks], prev[stacks-1], curr[stacks-1]);

        prev = curr;
    }
}

function GenerateCone(radius, height)
{
    var stacks=8;
	var slices=12;

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
        triangle(prev[0], prev[1], curr[1]);

        // create the triangles for this slice
        for (var j=1; j<stacks; j++) {
            prev1 = prev[j];
            prev2 = prev[j+1];

            curr1 = curr[j];
            curr2 = curr[j+1];

            quad(prev1, curr1, curr2, prev2);
        }

        prev = curr;
    }
}

// a, b, c, and d are all vec4 type
// special texture
function triangleS(a, b, c)
{
    // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normalize(a));

   	pointsArray.push(b);
   	normalsArray.push(normalize(b));

   	pointsArray.push(c);
   	normalsArray.push(normalize(c));
}

// a, b, c, and d are all vec4 type
// regular texture
function triangle(a, b, c)
{
    var t1 = subtract(b, a);
   	var t2 = subtract(c, b);
   	var normal = cross(t1, t2);
   	var normal = vec4(normal);
   	normal = normalize(normal);

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
function quadS(a, b, c, d)
{
    // triangle abc
   	pointsArray.push(a);
   	normalsArray.push(normalize(a));

   	pointsArray.push(b);
   	normalsArray.push(normalize(b));
   	pointsArray.push(c);
   	normalsArray.push(normalize(c));

    // triangle acd
   	pointsArray.push(d);
   	normalsArray.push(normalize(d));
   	pointsArray.push(a);
   	normalsArray.push(normalize(a));
   	pointsArray.push(c);
   	normalsArray.push(normalize(c));
}

// a, b, c, and d are all vec4 type
// regular texture
function quad(a, b, c, d)
{
    var t1 = subtract(b, a);
   	var t2 = subtract(c, a);
   	var normal = cross(t1, t2);
   	var normal = vec4(normal);
   	normal = normalize(normal);

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
    texture1.image.src='icecream-chocholate.jpg';

    // register the event handler to be called on loading an image
    texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }

    // -------create texture object 2------------
    texture2 = gl.createTexture();

    // create the image object
    texture2.image = new Image();
	//texture2.image.crossOrigin = "anonymous";

    // Tell the broswer to load an image
    texture2.image.src='icecream-waffle.jpg';


    // register the event handler to be called on loading an image
    texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }
}

function DrawIcecream()
{
    var r, s, t;

	// lighting and material for sphere
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 156/255, 97/255, 13/255, 1.0);
    materialSpecular = vec4( 156/255, 97/255, 13/255, 1.0 );
    materialShiness=50;
    SetupLightingMaterial();

    // use texture0 to draw the icecream top
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

	mvMatrixStack.push(modelViewMatrix);
    // draw sphere
	// size: ((stacks-2)*6+2*3)*slices=((16-2)*6+6)*24=2160
	s=scale4(.5, .5, .5);   // scale to 1/2 radius
    t=translate(0, 1.2, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 2160);
	modelViewMatrix=mvMatrixStack.pop();

    // lighting and material for cone
    materialAmbient = vec4( .2, .2, .2, 1.0 );
    materialDiffuse = vec4( 245/255, 250/255, 200/255, 1.0);
    materialSpecular = vec4( 245/255, 250/255, 200/255, 1.0 );
    SetupLightingMaterial();

    // use texture1 to draw the cone
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

	mvMatrixStack.push(modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw cone
    gl.drawArrays(gl.TRIANGLES, 36+2160, 540)
	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given radius
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	modelViewMatrix=mvMatrixStack.pop();
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

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}

function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   	// set up projection and modelview
   	projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
   	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    eye=vec3( Radius*Math.cos(theta*Math.PI/180.0)*Math.cos(phi*Math.PI/180.0),
              Radius*Math.sin(theta*Math.PI/180.0),
              Radius*Math.cos(theta*Math.PI/180.0)*Math.sin(phi*Math.PI/180.0));
   	modelViewMatrix=lookAt(eye, at, up);

	var r1 = rotate(xrot, 1, 0, 0);
	var r2 = rotate(yrot, 0, 0, 1);
    modelViewMatrix = mult(mult(modelViewMatrix, r1), r2);
  	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	// draw icecream cone
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, -0.7, 0);
	s=scale4(0.75, 0.75, 0.75);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawIcecream();
	modelViewMatrix=mvMatrixStack.pop();

    requestAnimFrame(render);
}
