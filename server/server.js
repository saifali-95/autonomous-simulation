const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000);
const io = socket(server);

let cars = {};

let start;

app.use(express.static('../client'));

const newConnection = function(socket){
  
  console.log('New Connection', socket.id);
  
  socket.on('newCarRequest', newCarRequest);
  socket.on('carPosition', carPosition);
  socket.on('controlCar', controlCar);

  //io.sockets.emit('controlCar', {start});

  function newCarRequest(data){
    cars[(socket.id).toString()] = data;
    console.log(cars);
    io.sockets.emit('newCarRequest', cars);
  }

  function carPosition(data) {
    //console.log(data);
  }

  //Control start and stop of 
  function controlCar(data) {
    start = data.start;
    socket.broadcast.emit('controlCar', {start});   
  }
}

io.sockets.on('connect', newConnection);

console.log('Server is running');