const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userHandler = require('./routeHandler/userHandler');
const companyHandler = require('./routeHandler/companyHandler');
const consumerHandler = require('./routeHandler/consumerHandler');
const adminHandler = require('./routeHandler/adminHandler');
const Blockchain = require('./blockchain');
const Block = require('./schemas/block');

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

// Route to get the current blockchain
const blockchain = new Blockchain();
app.get('/blockchain', async (req, res) => {
  try {
    const blocks = await Block.find({});  // Use the Block model to fetch data
    res.json(blocks);
  } catch (err) {
    res.status(500).send('Error retrieving blockchain');
  }
});

// Route to add a block
// index.js
app.post('/add-block', async (req, res) => {
    const { data } = req.body;
  
    try {
      // Get the last block from the database
      const lastBlock = await Block.findOne().sort({ index: -1 }); // Get the block with the highest index
  
      // If no blocks exist (in case of a fresh start), set the index to 0
      const newIndex = lastBlock ? lastBlock.index + 1 : 0;
  
      // Create a new block with the necessary fields
      const newBlock = new Block({
        index: newIndex,  // Increment index from the last block
        timestamp: Date.now(),
        data: data,
        previousHash: lastBlock ? lastBlock.hash : "0",  // Use previous block's hash or "0" for Genesis block
        hash: blockchain.calculateHash(data)  // Generate the hash for the new block
      });
  
      // Save the new block to the database
      //await newBlock.save();
      blockchain.addBlock(data);  // Add to in-memory blockchain chain
  
      res.json({ message: 'Block added to the blockchain', block: newBlock });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add block', details: err.message });
    }
  });
  
  

// Route to validate blockchain
app.get('/validate', (req, res) => {
  if (blockchain.isValid()) {
    res.json({ message: 'Blockchain is valid' });
  } else {
    res.json({ message: 'Blockchain is invalid' });
  }
});

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


