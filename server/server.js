const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000);
const io = socket(server);

let cars = [];
let sortedCars;

let start;

app.set("view engine", "ejs");
app.use(express.static('../client'));

const newConnection = function(socket){
  
  console.log('New Connection', socket.id);
  
  socket.on('newCarRequest', newCarRequest);
  socket.on('carPosition', carPosition);
  socket.on('controlCar', controlCar);

  //The callback function will execute when a user register's a new car;
  async function newCarRequest(data){
    cars.push(data);
    sortedCars = cars.sort((a, b) => {
      return a.position.x - b.position.x;
    });
  
    for(let i=0; i<=sortedCars.length-1; i++) {
 
      if(i===0 && sortedCars.length === 1){
        sortedCars[i]['leftObject'] = 'wall';
        sortedCars[i]['rightObject'] = 'wall';
      } else if (i===0 && !(sortedCars.length === 1)){
        sortedCars[i]['leftObject'] = 'wall';
        sortedCars[i]['rightObject'] = sortedCars[i+1]['userId'];
      } else if (i === sortedCars.length -1) {
        sortedCars[sortedCars.length -1]['leftObject'] = sortedCars[i-1]['userId'];
        sortedCars[sortedCars.length -1]['rightObject'] = 'wall'; 
      } else {
        sortedCars[i]['leftObject'] = sortedCars[i-1]['userId'];
        sortedCars[i]['rightObject'] = sortedCars[i+1]['userId'];
      }
    }
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