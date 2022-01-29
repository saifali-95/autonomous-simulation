const express = require('express');

const app = express();
const server = app.listen(3000);

app.use(express.static('../client'));

console.log('Server is running');