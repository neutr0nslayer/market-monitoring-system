const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const complaintSchema = require('../schemas/complaintSchema');
const { authenticateConsumer } = require('../middlewares/authMiddleware');

// Create a Complaint model
const Complaint = mongoose.model('Complaint', complaintSchema);

// Add this route to fetch consumer's complaints
router.get('/dashboard', authenticateConsumer, async (req, res) => {
    try {
        const complaints = await Complaint.find({ consumerId: req.user.userId });

        res.render('consumerDashboard', { complaints });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error while fetching dashboard data' });
    }
});

// Submit a complaint (Consumer only)
router.post('/submit-complaint',authenticateConsumer, async (req, res) => {
    try {
        const { companyId, title, description } = req.body;

        if (!companyId || !title || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newComplaint = new Complaint({
            consumerId: req.user.userId,
            companyId,
            title,
            description
        });

        await newComplaint.save();
        res.status(201).json({ message: 'Complaint submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error while submitting complaint' });
    }
});

// View consumer’s complaints (Consumer only)
router.get('/my-complaints', authenticateConsumer, async (req, res) => {
    try {
        const complaints = await Complaint.find({ consumerId: req.user.userId });

        res.status(200).json({ message: 'Complaints fetched successfully', data: complaints });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error while fetching complaints' });
    }
});

module.exports = router;
