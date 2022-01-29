const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000);
const io = socket(server);

app.use(express.static('../client'));

const newConnection = function(){
  console.log('socket');
}

io.sockets.on('connection', newConnection);




console.log('Server is running');