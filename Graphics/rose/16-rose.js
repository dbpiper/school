// parametric curves: rose, cardioid
var gl, program; 
var points; 
var STEPS=1000000;

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    var k=7;    // default values 
    //var d=1;
    
    var points = GeneratePoints(k);

    var n=initVertexBuffers(gl, points);
    if (n < 0) {
       console.log('Failed to set the positions of the vertices');
       return;
    }
    
    document.getElementById("cmdSubmit").onclick=function() {
        k=document.parameterForm.kVal.value;
        points = GeneratePoints(k);

        // Load the data into the GPU
        var bufferId = gl.createBuffer();
        if (!bufferId) {
           console.log('Failed to create the buffer object');
           return -1;
        }

        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

        // Associate out shader variables with our data buffer
        var a_Position = gl.getAttribLocation( program, "a_Position" );
        if(a_Position < 0) {
          console.log('Failed to get the storage location of a_Position');
          return -1;
        }
        gl.vertexAttribPointer( a_Position, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( a_Position );

        render();
    };

    render();
}

function initVertexBuffers(gl, points) {
    //  Configure WebGL
    //gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    if (!bufferId) {
       console.log('Failed to create the buffer object');
       return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    // Write data into the buffer object
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var a_Position = gl.getAttribLocation( program, "a_Position" );
    if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }

    // define how to read data from gl.ARRAY_BUFFER
    gl.vertexAttribPointer( a_Position, 2, gl.FLOAT, false, 0, 0 );
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray( a_Position );

    return points.length;
};

/*
// rose
function GeneratePoints(k)
{
    var vertices=[];
    vertices.push(vec2(0, 0));
    for (var theta=0; theta<STEPS; theta+=1) {
        var angle = theta*Math.PI/180.0;  // convert to radian
        vertices.push(vec2(Math.cos(k*angle)*Math.cos(angle), 
                           Math.cos(k*angle)*Math.sin(angle)));
    }

    return vertices;
}
*/

// cardioid
/*
function GeneratePoints(k) {

    if (k>2) k=0.5; // k should be < 2 for the figure to show

    var vertices=[vec2(0, 0)];
    for (var theta=0; theta<STEPS; theta+=1) {
        var angle = theta*Math.PI/180.0;
        vertices.push(vec2(k*(1+Math.cos(angle))*Math.cos(angle), 
                           k*(1+Math.cos(angle))*Math.sin(angle)));
    }

    return vertices;
}*/

// archimedean curve (2000 points)

function GeneratePoints(k) {
    var vertices=[];
    vertices.push(vec2(0, 0));
    for (var theta=0; theta<STEPS; theta+=1) {
        var angle = theta*Math.PI/180.0;  // convert to radian
        vertices.push(vec2(0.01*angle*Math.cos(angle), 
                           0.01*angle*Math.sin(angle)));
    }

    return vertices;
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, STEPS);
}
