# Getting Started with Autonomous Simulation App

The autonomous simulation app is designed for user's to visualize 1D motion of number of cars. Users can configure car speed, start point and color of the car. This is designed for multiple users to interact with each other using websockets. 

## Project Demo

!["Final Product Demo"](https://github.com/saifali-95/autonomous-simulation/blob/master/pictures/simulation-demo.gif)

## Dependencies
### Server Side

1. Express
2. socket.IO

### Client Side

1. p5.js


## Instructions
### Server Side

In the project directory, you can ~cd server folder:

1. Run npm install
2. Run npm start

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
Information about all cars can be accessed through [http://localhost:3000/cars](http://localhost:3000/cars) & [http://localhost:3000/cars/:id](http://localhost:3000/:id)
