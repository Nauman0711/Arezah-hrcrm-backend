const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authMiddleware = require('../../../middlewares/auth');
const authorize = require('../../../middlewares/authorize');

router.put('/:id', authMiddleware, authorize(['ceo']), async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = await User.findById(req.user.userId).select("company");

        const employee = await User.findOneAndUpdate(
            { _id: id, company: currentUser.company },
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
