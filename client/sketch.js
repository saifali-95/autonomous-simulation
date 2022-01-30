//speed and switch variables
let start;
let speed;
let x;
let newCar = {};
let cars = {};
let carId;

//Initial setup of window size
function setup() {
  createCanvas(1500, 600);

  socket = io.connect("http://localhost:3000"); 
  
  
  //Input field for user to enter speed of the car and direction
  speed = createInput().attribute('placeholder', 'Speed (+/-)');
  speed.position(20, 800);

  //Input field for user to enter Spot where to place the car in the x-coordinate
  x = createInput().attribute('placeholder', 'Car Position');
  x.position(20, 830);

  //Submit button to send the user input to the server using socket.io
  submitButton = createButton('submit');
  submitButton.position(20, 860);
  submitButton.mousePressed(()=> {
    newCar = {
        speed : Number(speed.value()),
        position : {
            x: Number(x.value()),
            g: 250,
        }
    }
    socket.emit('newCarRequest', newCar); 
  });
  
  //Start and Stop Button
  button1 = createButton("Start");
  button1.style("font-size", "30px");
  button1.style("background-color", "#404DF4");
  button1.position(1400, 20).mousePressed(() => {
    
       
    if (!start) {
      start = true;
      button1.html("Stop");
      button1.style("background-color", "#F30303");
      socket.emit('controlCar', {start: true}); 
    } else {
      start = false;
      button1.html("Start");
      button1.style("background-color", "#404DF4");
      socket.emit('controlCar', {start: false}); 
    }
    
  });

  socket.on('newCarRequest', newCarRequest);
  
  function newCarRequest(data) {
    cars = data;
    console.log(cars);
    carId = Object.keys(cars)[Object.keys(cars).length-1];
  }

  //Get's a signal to stop or start the car.
  socket.on('controlCar', carMotion); 

  function carMotion(data) {
    console.log('Received Data to server', data.start);
    start = data.start;

    if (start) {
        button1.html("Stop");
        button1.style("background-color", "#F30303");
    } else {
        button1.html("Start");
        button1.style("background-color", "#404DF4");
    }
    
  }
}

//Drawing objects and their motion
function draw() {
  background("#EBF1FF");

  //Add Sun
  fill(255, 255, 0);
  ellipse(50, 50, 60, 60);

  //Add Road
  noStroke();
  fill("#808080");
  rect(0, 450, 1500, 250);

  //Add Walls
  fill("#9D6643");
  rect(0, 200, 50, 275);
  rect(1450, 200, 50, 275);

  for(const car in cars) {
    stroke(50);
    fill("#E24040");
    rect(cars[car]['position']['x'], 400, 110, 50, 20);
    fill(100, 100, 100);
    ellipse(cars[car]['position']['x'], 450, 40, 40);
    ellipse(cars[car]['position']['x'] + 110, 450, 40, 40);
  }

  //Start/Stop cars
  if (start) {
    //speed of the car
    cars[carId]['position']['x'] = cars[carId]['position']['x'] + cars[carId]['speed'];
    // car2.x = car2.x + speed2;
    socket.emit('carPosition', cars[carId]['position']['x']); 
  }
}
