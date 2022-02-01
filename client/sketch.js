//speed and switch variables
let start;
let speed;
let x;
let color;
let newCar = {};
let cars = [];
let userId;
let carId;

//Initial setup of window size
function setup() {
  createCanvas(1500, 600);

  socket = io.connect("http://localhost:3000");

  socket.on("connect", function () {
    userId = socket.id;
  });

  //Input field for user to enter speed of the car and direction
  speed = createInput().attribute("placeholder", "Speed (+/-)");
  speed.position(20, 700);

  //Input field for user to enter Spot where to place the car in the x-coordinate
  x = createInput().attribute("placeholder", "Car Position");
  x.position(20, 730);

  //Input field for user to enter car color
  color = createInput().attribute("placeholder", "Car Color");
  color.position(20, 760);

  //Submit button to send the user input to the server using socket.io
  submitButton = createButton("submit");
  submitButton.position(250, 760);
  submitButton.mousePressed(() => {
    newCar = {
      userId: userId,
      speed: Number(speed.value()),
      position: {
        x: Number(x.value()),
        g: 250,
      },
      color: color.value()
    };
    socket.emit("newCarRequest", newCar);
  });

  //Start and Stop Button
  button1 = createButton("Start");
  button1.style("font-size", "30px");
  button1.style("background-color", "#00FF00");
  button1.position(20, 650).mousePressed(() => {
    if (!start) {
      start = true;
      button1.html("Stop");
      button1.style("background-color", "#FF0000");
      socket.emit("controlCar", { start: true });
    } else {
      start = false;
      button1.html("Start");
      button1.style("background-color", "#00FF00");
      socket.emit("controlCar", { start: false });
    }
  });

  socket.on("newCarRequest", newCarRequest);

  function newCarRequest(data) {
    cars = data;
    carId = userId;
    console.log('cars sorted data', cars);
  }

  socket.on("carPosition", updateCarPosition);

  function updateCarPosition(data) {
    cars = data;
  }

  //Get's a signal to stop or start the car.
  socket.on("controlCar", carMotion);

  function carMotion(data) {
    start = data.start;

    if (start) {
      button1.html("Stop");
      button1.style("background-color", "#FF0000");
    } else {
      button1.html("Start");
      button1.style("background-color", "#00FF00");
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

  for (const car of cars) {
    stroke(50);
    fill(car['color']);
    rect(car["position"]["x"], 400, 110, 50, 20);
    fill(100, 100, 100);
    ellipse(car["position"]["x"], 450, 40, 40);
    ellipse(car["position"]["x"] + 110, 450, 40, 40);
  }

  //Start/Stop cars
  if (start) {
    
    for (let i=0; i<= cars.length-1; i++) {
      cars[i]['position']['x'] = cars[i]['position']['x'] + cars[i]['speed'];

      //boolean statement for the car turning around
      if (
        cars[i]["position"]["x"] + 110 >= 1450 ||
        cars[i]["position"]["x"] < 50
      ) {
        cars[i]["speed"] = cars[i]["speed"] * -1;
      }

      if (i === 0) {
        if (cars[i]["position"]["x"] + 110 + cars[i]['speed'] >= cars[i+1]["position"]["x"] + cars[i+1]['speed']) {
          cars[i]["speed"] = cars[i]["speed"] * -1;
          cars[i+1]["speed"] = cars[i+1]["speed"] * -1;
        }
      }
      else if (i === cars.length -1) {
        if (cars[i]["position"]["x"] + cars[i]['speed'] <= cars[i-1]["position"]["x"] + cars[i-1]['speed'] + 110) {
          cars[i]["speed"] = cars[i]["speed"] * -1;
          cars[i-1]["speed"] = cars[i-1]["speed"] * -1;
        }
      } else {
        if (cars[i]["position"]["x"] + 110 + cars[i]['speed'] >= cars[i+1]["position"]["x"] + cars[i+1]['speed']) {
          cars[i]["speed"] = cars[i]["speed"] * -1;
          cars[i+1]["speed"] = cars[i+1]["speed"] * -1;
        }
      }
      socket.emit("carPosition", cars);
    }
  }
}
