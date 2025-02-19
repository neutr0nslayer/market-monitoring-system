const mongoose = require('mongoose');

const productMetricsSchema = new mongoose.Schema({
    // companyId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Company',  // Link to the company that owns the product.
    //     required: true
    // },
    productName: {
        type: String,
        required: true
    },
    productOrigin: {
        type: String,  // Location or source of the product (e.g., supplier, country, etc.)
        required: true
    },
    basePrice: {
        type: Number,  // Price the company pays for the product
        required: true
    },
    sellingPrice: {
        type: Number,  // Price the company sells the product for
        required: true
    },
    quantityBought: {
        type: Number,  // How many products the company bought
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// export the schema
module.exports = productMetricsSchema;
