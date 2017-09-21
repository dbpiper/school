// transformation exercise

var gl;
var points;
var program;

var xstep=0.01;
var ystep=0.01;
var translate;
var rotate;
var scale;

var version = 1;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Four Vertices
    
    var vertices = [
        vec2( 0, 0 ),
        vec2(  0.2,  0 ),
        vec2(  0.2, 0.2 ),
        vec2( 0, 0.2)
    ];

    var a = document.getElementById("OneButton")
    a.addEventListener("click", function(){
        version = 1;
        rotate=[0, 0, 0];
        scale=[1, 1, 1];
        translate=[0, 0, 0];
        render();
    });

    var a = document.getElementById("TwoButton")
    a.addEventListener("click", function(){
        version = 2;
        rotate=[0, 0, 0];
        scale=[1, 1, 1];
        translate=[-1, 0, 0];
        render();
    });

    var a = document.getElementById("ThreeButton")
    a.addEventListener("click", function(){
        version = 3;
        rotate=[0, 0, 0];
        scale=[1, 1, 1];
        translate=[-1, 0, 0];
        render();
    });

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .9, 0.9, 0.9, 1.0 );
    
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

    render();
};


function render() {

    var STEPS=100;
    gl.clear( gl.COLOR_BUFFER_BIT );

    // transformation parameters set in button event handler
    gl.uniform3fv(gl.getUniformLocation(program, "sc"), scale);
    gl.uniform3fv(gl.getUniformLocation(program, "theta"), rotate);
    gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);

    if (version == 1)
    {
        gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    }
    else if (version == 2)   // square moves from left side of the screen to the right side and repeats
    {
       
        var rsize = 0.2;
        var windowWidth = 1;
        var windowHeight = 1;

        var x=translate[0];

	    // Actually move the square
        x += xstep;
        
        // Reverse direction when it reaches left or right edge
        if(x > windowWidth-rsize || x < -windowWidth)
            xstep = -xstep;
	
        translate[0] = x;
        gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);
        
        gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );   
        requestAnimationFrame(render);
    }
    else if (version == 3)  // bouncing in a square
    {
        var rsize = 0.2;
        var windowWidth = 1;
        var windowHeight = 1;

        var x=translate[0];
        var y=translate[1];

	    // Actually move the square
        x += xstep;
        y += ystep;
	
        // Reverse direction when it reaches left or right edge
        if(x > windowWidth-rsize || x < -windowWidth)
            xstep = -xstep;
	
        // Reverse direction when you reach top or bottom edge
        if (y > windowHeight-rsize || y < -windowHeight)
            ystep = -ystep;
	
        translate[0] = x;
        translate[1] = y;
        gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);
        gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
        
        requestAnimationFrame(render);
    }
}
