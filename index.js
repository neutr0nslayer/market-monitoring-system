const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userHandler = require('./routeHandler/userHandler');
const companyHandler = require('./routeHandler/companyHandler');
const consumerHandler = require('./routeHandler/consumerHandler');
const adminHandler = require('./routeHandler/adminHandler');

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());

// Connect to MongoDB
const mongoURI = 'mongodb://192.168.0.109:27017/market-monitoring-system';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err)
);

// app routes
app.use('/user', userHandler);
app.use('/company', companyHandler);
app.use('/consumer', consumerHandler);

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


