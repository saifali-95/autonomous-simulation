const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000);
const io = socket(server);

app.use(express.static('../client'));

const newConnection = function(socket){
  console.log('New connection', socket.id);

  socket.on('newCarRequest', newCarRequest);
  socket.on('carPosition', carPosition);
  socket.on('controlCar', controlCar);

  function newCarRequest(data){
    console.log(data);
    io.sockets.emit('newCarRequest', data);
  }

  function carPosition(data) {
    console.log(data);
  }

}

io.sockets.on('connection', newConnection);

console.log('Server is running');