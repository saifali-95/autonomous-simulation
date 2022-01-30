//speed and switch variables
let speed1 = 1.0;
let speed2 = -1.0;
let start = false;
let speed;
let x;
let newCar = {};

//x and y axis variables of cars
let car1 = {
  x: 100,
  g: 250,
};

let car2 = {
  x: 800,
  g: 250,
};

//Initial setup of window size
function setup() {
  createCanvas(1500, 600);

  socket = io.connect("http://localhost:3000"); 
  
  //Input for user to enter speed of the car and direction
  speed = createInput().attribute('placeholder', 'Speed (+/-)');
  speed.position(20, 800);

  //Input for user to enter Spot where to place the car in the x-coordinate
  x = createInput().attribute('placeholder', 'Car Position');
  x.position(20, 830);

  //Submit button to send the input data from the user to the server using socket.io
  submitButton = createButton('submit');
  submitButton.position(20, 860);
  submitButton.mousePressed(()=> {
    newCar = {
        speed : speed.value(),
        position : {
            x: x.value(),
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
    } else {
      start = false;
      button1.html("Start");
      button1.style("background-color", "#404DF4");
    }
  });
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

  //the car1 itself
  stroke(50);
  fill("#F44040");
  rect(car1.x, 400, 110, 50, 20);
  fill(100, 100, 100);
  ellipse(car1.x, 450, 40, 40);
  ellipse(car1.x + 110, 450, 40, 40);

  //the car2 itself
  fill("#404DF4");
  rect(car2.x, 400, 110, 50, 20);
  stroke(50);
  fill(100, 100, 100);
  ellipse(car2.x, 450, 40, 40);
  ellipse(car2.x + 110, 450, 40, 40);

  //Start/Stop cars
  if (start) {
    //speed of the car
    car1.x = car1.x + speed1;
    car2.x = car2.x + speed2;
    socket.emit('carPosition', car1.x); 

    //boolean statement for the car turning around
    if (car1.x + 110 >= 1450 || car1.x < 50 || car1.x + 110 === car2.x) {
      speed1 = speed1 * -1;
    }

    if (car2.x + 110 >= 1450 || car2.x < 50 || car1.x + 110 === car2.x) {
      speed2 = speed2 * -1;
    }
  }
}
