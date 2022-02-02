const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000);
const io = socket(server);

let cars = [];

let start;

app.set("view engine", "ejs");
app.use(express.static('../client'));

const newConnection = function(socket){
  
  console.log('New Connection', socket.id);
  
  socket.on('newCarRequest', newCarRequest);
  socket.on('carPosition', carPosition);
  socket.on('controlCar', controlCar);

  //io.sockets.emit('controlCar', {start});

  function newCarRequest(data){
    cars.push(data);
    let sortedCars = cars.sort((a, b) => {
          return a.position.x - b.position.x;
    });
    io.sockets.emit('newCarRequest', sortedCars);
  }

  function carPosition(data) {
    cars = data;
    socket.broadcast.emit('carPosition', cars);  
  }

  //Control start and stop of 
  function controlCar(data) {
    start = data.start;
    socket.broadcast.emit('controlCar', {start});   
  }
}

io.sockets.on('connect', newConnection);

app.get("/:id", (req, res) => {
  const userId = req.params.id;

  const carInfo =  cars.filter(car => {
    return car.userId === userId;
  })

  if(carInfo.length !== 0){
    res.json(carInfo);
  } else {
    res.send('Car Info Not Available')
  }

  return;
});

console.log('Server is running');