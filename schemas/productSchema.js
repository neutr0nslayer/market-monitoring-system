
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productID: {
        type: String, // companyID|productName|batchNumber
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    // batchNumber, quantity 
    manufacturer: {
        type: String, 
        required: true
    },
    basePrice: {
        type: Number,  // Price the company pays for the product
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = productSchema;

