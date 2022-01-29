const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000);
const io = socket(server);

app.use(express.static('../client'));

const newConnection = function(socket){
  console.log('socket');

  socket.on('mouse', mouseMsg);

  function mouseMsg(data){
    console.log(data);
    io.sockets.emit('mouse', data);
  }
}

io.sockets.on('connection', newConnection);

console.log('Server is running');