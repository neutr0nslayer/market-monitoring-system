const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userSchema = require('../schemas/userSchema'); // User Schema
const complaintSchema = require('../schemas/complaintSchema'); // Complaint Schema

// Models
const User = mongoose.model('User', userSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);

// Middleware
const { authenticateAdmin } = require('../middlewares/authMiddleware');

// Get all company details (Admin only)
router.get('/companies', authenticateAdmin, async (req, res) => {
    try {
        const companies = await User.find({ role: 'company' }).select('-password'); // Exclude passwords

        res.status(200).json({ message: 'Companies fetched successfully', data: companies });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching company details' });
    }
});

// Get all consumer complaints (Admin only)
router.get('/complaints', authenticateAdmin, async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('consumerId', 'name email').populate('companyId', 'companyDetails.name');

        res.status(200).json({ message: 'Complaints fetched successfully', data: complaints });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching complaints' });
    }
});


// Export the router
module.exports = router;
