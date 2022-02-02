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

  //The callback function will execute when a user register's a new car;
  function newCarRequest(data){
    cars.push(data);
    let sortedCars = cars.sort((a, b) => {
          return a.position.x - b.position.x;
    });
    io.sockets.emit('newCarRequest', sortedCars);
  }

   //The callback function will execute when car's starts moving and will share live position;
  function carPosition(data) {
    cars = data;
    socket.broadcast.emit('carPosition', cars);  
  }

  //Control car start and stop motion
  function controlCar(data) {
    start = data.start;
    socket.broadcast.emit('controlCar', {start});   
  }
}

io.sockets.on('connect', newConnection);

//Route to get the information of all the cars;
app.get("/cars", (req, res) => {
  if(cars.length === 0){
    return res.send('No cars are registered yet');
  } 
  return res.json(cars);
});

//Route to get the information of the specific car using userId/carId;
app.get("/cars/:id", (req, res) => {
  const userId = req.params.id;

  const carInfo =  cars.filter(car => {
    return car.userId === userId;
  })

  if(carInfo.length !== 0){
    return res.json(carInfo);
  } else {
    return res.send('Car Info Not Available')
  }
});


console.log('Server is running');