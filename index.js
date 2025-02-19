const express = require('express');
const mongoose = require('mongoose');
const userHandler = require('./routeHandler/userHandler');

// express app initialization
const app = express();
app.use(express.json());
const port = 3000;

// Connect to MongoDB
const mongoURI = 'mongodb://192.168.0.109:27017/market-monitoring-system';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err)
);

// app routes
app.use('/user', userHandler);

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
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


