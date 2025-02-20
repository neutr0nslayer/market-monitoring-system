
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const productMetricsSchema = require('../schemas/productMetricsSchema');
const userSchema = require('../schemas/userSchema');
const product = require('../schemas/productSchema');
const { authenticateCompany } = require('../middlewares/authMiddleware');

// Assuming you've already created a model for company data.
const ProductMetrics = mongoose.model('ProductMetric', productMetricsSchema);
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', product);


// Example Express route
router.get('/new', async (req, res) => {
    // Fetch data here from your respective DB model collections

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const companyId = decoded.userId;
    const products = await Product.find();
    const toCompanies = await User.find({ role: 'company' });

    res.render('productMetricsForm', { companyId, products, toCompanies });
});

// Create a new product submission (Company only)
router.post('/submit-product', authenticateCompany, async (req, res) => {
    try {
        const { companyId, productID, productOrigin, basePrice, sellingPrice, quantityBought } = req.body;

        if (!companyId || !productID || !basePrice || !sellingPrice || !quantityBought) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure that the company is submitting data for their own company
        if (req.user.userId.toString() !== companyId.toString()) {
            return res.status(403).json({ error: 'You can only submit data for your own company.' });
        }

        const newProduct = new ProductMetrics({
            companyId,
            productID,
            productOrigin,
            basePrice,
            sellingPrice,
            quantityBought
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error while submitting product' });
    }
});

router.get('/view-submissions', authenticateCompany, async (req, res) => {
    try {
        const submissions = await ProductMetrics.find();
        res.status(200).json({ message: 'Submissions fetched successfully', data: submissions });
    } catch (err) {
        res.status(500).json({ error: 'Error while fetching submissions' });
    }
});

// export the router
module.exports = router;

