const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const productMetricsSchema = require('../schemas/productMetricsSchema');
const { authenticateCompany } = require('../middlewares/authMiddleware');

// Assuming you've already created a model for company data.
const ProductMetrics = mongoose.model('ProductMetric', productMetricsSchema);


// Create a new product submission (Company only)
router.post('/submit-product', authenticateCompany, async (req, res) => {
    try {
        const { companyId, productID, productName, productOrigin, basePrice, sellingPrice, quantityBought } = req.body;

        if (!productName || !basePrice || !sellingPrice || !quantityBought) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure that the company is submitting data for their own company
        // if (req.user.userId.toString() !== companyId.toString()) {
        //     return res.status(403).json({ error: 'You can only submit data for your own company.' });
        // }

        const newProduct = new ProductMetrics({
            productName,
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

// Get company’s submissions (Company only)
// router.get('/view-submissions', authenticateCompany, async (req, res) => {
//     try {
//         const submissions = await CompanyMetrics.find({ companyId: req.user.userId });

//         res.status(200).json({ message: 'Submissions fetched successfully', data: submissions });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error while fetching submissions' });
//     }
// });

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
