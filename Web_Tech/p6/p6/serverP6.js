(function() {
  'use strict';

  /*
    Filename: serverP6.js
    Author: David Piper
    Description:
      The purpose of this file is to act as the server for Project 6.
      Furthermore, it handles all of the logic for this project, the
      two clients only handle drawing of the meshes, and handling keyboard
      events.

      The server receives the keyboard events, which tell it which command
      to perform, manipulates the respective mesh, and then transmits
      the updates mesh positions/rotations to both clients.

      This approach means that there is not a subtle delay between clients,
      or in a gaming sense, it means that one player does not have a slight
      advantage over the other in making moves. Since nothing is handled on
      the client, each player is getting the updated mesh positions and
      rotations at about the same time. It also means that this game
      is safe from client-side js hacking, since one cannot inject invalid
      moves into the client and have this transmitted to the server.
  */

  const port = 5946;
  const rotateStepSize = 0.08;
  const moveStepSize = 2;

  const WebSocketServer = require('ws').Server;

  const wss = new WebSocketServer( { port: port } );

  const clients = [];

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

  const UNINITIALIZED_MESHES = Object.freeze({
    p1Mesh: {
      position: {},
      rotation: {},
    },
    p2Mesh: {
      position: {},
      rotation: {},
    }
  });

  // will be initialized once one of the clients connects
  let meshes = JSON.parse(JSON.stringify(UNINITIALIZED_MESHES));


  let numClients = 0;

  wss.on('listening', function() {
      console.log("listening on port " + port);
  });

  wss.on('connection', function(ws) {
      numClients++;
      let client = {
        ws: ws,
        playerNum: numClients,
      }
      clients[client.playerNum-1] = client;
      let message = {
        type: MessageTypes.PlayerNum,
        playerNum: client.playerNum,
      };
      ws.send(JSON.stringify(message));
      if (!isEmptyObject(meshes.p1Mesh.position)) {
        sendMeshesToClient(client);
      }
      ws.on('message', function(message) {
        handleMessage(message);
      });
      ws.on('close', function() {
        if (client.playerNum == 1) {
          clients.splice(0, 1);
        } else {
          clients.splice(1, 1);
        }
        numClients--;
        if (numClients == 0) {
          meshes = JSON.parse(JSON.stringify(UNINITIALIZED_MESHES));
        }
        console.log('Removed: Player ' + JSON.stringify(client.playerNum));
      });
  });

  function doCommand(playerNum, command) {

    let playerMesh;
    if (playerNum == 1) {
      playerMesh = meshes.p1Mesh;
    } else {
      playerMesh = meshes.p2Mesh;
    }

    switch (command) {
      case Commands.Up:
        moveUp(playerMesh);
        break;
      case Commands.Down:
        moveDown(playerMesh);
        break;
      case Commands.Left:
        moveLeft(playerMesh);
        break;
      case Commands.Right:
        moveRight(playerMesh);
        break;
      case Commands.In:
        moveIn(playerMesh);
        break;
      case Commands.Out:
        moveOut(playerMesh);
        break;
      case Commands.RotateX:
        rotateX(playerMesh);
        break;
      case Commands.RotateY:
        rotateY(playerMesh);
        break;
      case Commands.RotateZ:
        rotateZ(playerMesh);
        break;
      default:
        console.log('Invalid command!');
    }
  }

  // check if an object is empty
  function isEmptyObject(object) {
    return Object.keys(object).length === 0 && object.constructor === Object;
  }

  function sendMeshesToClient(client) {
      const message = {
        type: MessageTypes.MeshChange,
        p1Mesh: {
          position: meshes.p1Mesh.position,
          rotation: meshes.p1Mesh.rotation,
        },
        p2Mesh: {
          position: meshes.p2Mesh.position,
          rotation: meshes.p2Mesh.rotation,
        },
      };
      client.ws.send(JSON.stringify(message));
  }

  function sendMeshes() {
      clients.forEach(function(client) {
        sendMeshesToClient(client);
      });
  }

  function handleMessage(message) {
    let messageObj = JSON.parse(message);
    // only init meshes if they are uninitialized
    if (messageObj.type == MessageTypes.MeshInit && isEmptyObject(meshes.p1Mesh.position)) {
      meshes.p1Mesh = messageObj.p1Mesh;
      meshes.p2Mesh = messageObj.p2Mesh;
    } else if (messageObj.type == MessageTypes.Command) {
      doCommand(messageObj.playerNum, messageObj.command);
      const message = {
        type: MessageTypes.MeshChange,
        p1Mesh: {
          position: meshes.p1Mesh.position,
          rotation: meshes.p1Mesh.rotation,
        },
        p2Mesh: {
          position: meshes.p2Mesh.position,
          rotation: meshes.p2Mesh.rotation,
        },
      };
      sendMeshes();
    }
  }
  function rotateX(mesh) {
    mesh.rotation._x += rotateStepSize;
  }

  function rotateY(mesh) {
    mesh.rotation._y += rotateStepSize;
  }

  function rotateZ(mesh) {
    mesh.rotation._z += rotateStepSize;
  }

  // move in towards the far side of the scene
  function moveIn(mesh) {
    mesh.position.z -= moveStepSize;
  }

  // move out towards the screen
  function moveOut(mesh) {
    mesh.position.z += moveStepSize;
  }

  function moveUp(mesh) {
    mesh.position.y += moveStepSize;
  }

  function moveDown(mesh) {
    mesh.position.y -= moveStepSize;
  }

  function moveLeft(mesh) {
    mesh.position.x -= moveStepSize;
  }

  function moveRight(mesh) {
    mesh.position.x += moveStepSize;
  }
})();
