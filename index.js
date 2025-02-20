const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userHandler = require('./routeHandler/userHandler');
const companyHandler = require('./routeHandler/companyHandler');
const consumerHandler = require('./routeHandler/consumerHandler');
const adminHandler = require('./routeHandler/adminHandler');
const blockchainHandler = require('./routeHandler/blockChainHandler');

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// app routes
app.use('/user', userHandler);
app.use('/company', companyHandler);
app.use('/consumer', consumerHandler);
app.use('/admin', adminHandler);
app.use('/blockchain', blockchainHandler);


app.get('/', (req, res) => {
  res.send('Hello, Docker!');
});

// default error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
      return next(err);
  }
  res.status(500).json({ error: err });
});

// start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});


