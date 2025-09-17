const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authMiddleware = require('../../../middlewares/auth');
const authorize = require('../../../middlewares/authorize');

router.get('/', authMiddleware, authorize(['ceo', 'admin', 'manager']), async (req, res) => {
    try {
        const employees = await User.find({ type: 'employee' }).select('-password -otp -otpExpires');
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
