P6 = (function() {
  'use strict';

  const port = 5946;
  const wwwUrl = 'ws://www.cs.mtsu.edu:';
  const localUrl = 'ws://localhost:';

  const MessageTypes = Object.freeze({
      'MeshInit': 1,   // client -> server
      'MeshChange': 2, // server -> client
      'Command': 3,   // client -> server
      'PlayerNum': 4, // server -> client
  });

  const Commands = Object.freeze({
    'Up': 1,
    'Down': 2,
    'Left': 3,
    'Right': 4,
    'In': 5,
    'Out': 6,
    'RotateX': 7,
    'RotateY': 8,
    'RotateZ': 9
  });

  let socketOpen = false;
  let image;
  let playerNum = 0; // placeholder value until set by sever message
  let p1Mesh;
  let p2Mesh;
  let scene;
  let camera;
  let renderer;
  let socket;
  
  function draw() {
    renderer.render(scene, camera);
  }

  function connect() {
    socket = new WebSocket(wwwUrl + port);
    socket.addEventListener('error', function(error) {
      socket = new WebSocket(localUrl + port);
      socket.addEventListener('message', handleMessage);
      socket.addEventListener('open', sendMeshesStart);
    });

    socket.addEventListener('message', handleMessage);
    socket.addEventListener('open', sendMeshesStart);
  }

  function handleMessage(event) {
    let messageObj = JSON.parse(event.data);

    if (messageObj.type == MessageTypes.MeshChange) {
      console.log(event.data);

      p1Mesh.position.x = messageObj.p1Mesh.position.x;
      p1Mesh.position.y = messageObj.p1Mesh.position.y;
      p1Mesh.position.z = messageObj.p1Mesh.position.z;
      p1Mesh.rotation.x = messageObj.p1Mesh.rotation._x;
      p1Mesh.rotation.y = messageObj.p1Mesh.rotation._y;
      p1Mesh.rotation.z = messageObj.p1Mesh.rotation._z;

      p2Mesh.position.x = messageObj.p2Mesh.position.x;
      p2Mesh.position.y = messageObj.p2Mesh.position.y;
      p2Mesh.position.z = messageObj.p2Mesh.position.z;
      p2Mesh.rotation.x = messageObj.p2Mesh.rotation._x;
      p2Mesh.rotation.y = messageObj.p2Mesh.rotation._y;
      p2Mesh.rotation.z = messageObj.p2Mesh.rotation._z;

      draw();
    } else if (messageObj.type == MessageTypes.PlayerNum) {
      playerNum = messageObj.playerNum;
    } else {
      console.log(event.data);
      console.log('Invalid command!');
    }
  }

  function sendMeshesStart() {
    socketOpen = true; // the socket is now open
    console.log('sending meshes');
    const message = {
      type: MessageTypes.MeshInit,
      p1Mesh: {
        position: p1Mesh.position,
        rotation: p1Mesh.rotation,
      },
      p2Mesh: {
        position: p2Mesh.position,
        rotation: p2Mesh.rotation,
      },
    }
    socket.send(JSON.stringify(message));
  }

  function send(command) {
    if (socketOpen) {
      let playerMesh;
      if (playerNum === 1) {
        playerMesh = p1Mesh;
      } else {
        playerMesh = p2Mesh;
      }
      const message = {
        type: MessageTypes.Command,
        command: command,
        playerNum: playerNum,
      }
      console.log(message);
      socket.send(JSON.stringify(message));
    }
  }

  function keydown(key) {
    switch (key) {
        case 'd':
        case 'D':
          send(Commands.Right);
          break;
        case 'a':
        case 'A':
          send(Commands.Left);
          break;
        case 'w':
        case 'W':
          send(Commands.Up);
          break;
        case 's':
        case 'S':
          send(Commands.Down);
          break;
        case 'x':
        case 'X':
          send(Commands.RotateX);
          break;
        case 'y':
        case 'Y':
          send(Commands.RotateY);
          break;
        case 'z':
        case 'Z':
          send(Commands.RotateZ);
          break;
        case 'e':
        case 'E':
          send(Commands.In);
          break;
        case 'c':
        case 'C':
          send(Commands.Out);
          break;
        default:
          console.log('Invalid key!');
    }
  }

  function createScene() {
    var canvas = document.getElementById("canvas");
    var width = canvas.width;
    var height = canvas.height;

    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setClearColor(0xFFFFFF);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 150);


    var light = new THREE.SpotLight(0xFFFFFF);
    light.position.set(50, 50, 150);
    scene.add(light);

    window.addEventListener("keydown", function(event) {
      keydown(event.key);
    });
  }

  function createP1Mesh() {
    var geometry = new THREE.BoxGeometry(20, 20, 20);
    var material = new THREE.MeshPhongMaterial({color: 0x0000FF});
    p1Mesh = new THREE.Mesh(geometry, material);
    scene.add(p1Mesh);
    p1Mesh.position.y += 10;

    p1Mesh.rotation.set(10, 10, 0);
  }

  function createP2Mesh() {
      var geometry = new THREE.BoxGeometry(20, 20, 20);
      var texture = new THREE.Texture(image);
      texture.needsUpdate = true;
      var material = new THREE.MeshPhongMaterial({map: texture});
      p2Mesh = new THREE.Mesh(geometry, material);
      scene.add(p2Mesh);
      p2Mesh.position.y += 10;
  }

  function createWorld() {
    createScene();
    createP1Mesh();
    createP2Mesh();
    connect();
    draw();
  }

  function initiate() {
    image = document.createElement('img');
    image.src = 'resources/images/crate.jpg';
    image.addEventListener('load', createWorld);
  }

  window.addEventListener("load", initiate);
})();
