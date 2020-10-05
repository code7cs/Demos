const express = require('express');
const app = express();
// const http = require('http');

// app.use('/', (req, res, next) => {
//     console.log('This always runs!');
//     next();
// });

app.use('/add-product', (req, res, next) => {
  console.log('In another middleware!');
  res.send('<h1>The "Add Product" Page</h1>');
});

app.use('/', (req, res, next) => {
  console.log('In another middleware!!!!!');
  res.send('<h1>Hello from Express!</h1>');
  res.end();
});
app.listen(3000);

// const server = http.createServer(app);

// app.use((req, res, next) =>{
//   console.log("In the first middleware")
//   next();
// });

// app.use((req, res, next) =>{
//   console.log("In the second middleware")
// });


// server.listen(3000);
