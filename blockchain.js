// blockchain.js
const crypto = require('crypto');
const Block = require('./schemas/block');  // Import Block model

// Blockchain class
class Blockchain {
  constructor() {
    this.chain = [];
    // Load the latest block from the database or create the Genesis block if the database is empty
    this.loadBlockchain();
  }

  // Load the blockchain from MongoDB or create Genesis block if no blocks exist
  async loadBlockchain() {
    try {
      // Fetch the last block from the database
      const lastBlock = await Block.findOne().sort({ index: -1 });  // Get the block with the highest index

      if (!lastBlock) {
        // If no blocks exist, create a Genesis block
        const genesisBlock = new Block({
          index: 0,
          timestamp: Date.now(),
          data: "Genesis Block",
          previousHash: "0",
          hash: "0000000000"  // Fixed hash for Genesis block
        });
        await genesisBlock.save();  // Save the Genesis block to the database
        this.chain.push(genesisBlock);  // Add it to the in-memory chain
      } else {
        this.chain.push(lastBlock);  // Add the last block to the in-memory chain
      }
    } catch (err) {
      console.error('Error loading blockchain:', err);
    }
  }

  // Add a new block
  addBlock(newBlockData) {
    const previousBlock = this.chain[this.chain.length - 1];
    const newBlock = new Block({
      index: this.chain.length,
      timestamp: Date.now(),
      data: newBlockData,
      previousHash: previousBlock.hash,
      hash: this.calculateHash(newBlockData)
    });

    // Save the new block to the database
    newBlock.save();
    this.chain.push(newBlock);  // Add the new block to the in-memory chain
  }

  // Helper method to calculate block hash
  calculateHash(data) {
    return crypto
      .createHash('sha256')
      .update(data + Date.now())
      .digest('hex');
  }

  // Validate the chain
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if hash is valid
      if (currentBlock.hash !== this.calculateHash(currentBlock.data)) {
        return false;
      }

      // Check if previous hash is valid
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Blockchain;
