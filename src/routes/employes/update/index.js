const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authMiddleware = require('../../../middlewares/auth');
const authorize = require('../../../middlewares/authorize');
const companyScope = require('../../../middlewares/company-scope');

router.put('/:id', authMiddleware, companyScope, authorize(['ceo']), async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await User.findOneAndUpdate(
            { _id: id, company: req.companyId },
            req.body,
            { new: true }
        ).select("-password -otp -otpExpires");

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
