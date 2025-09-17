const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authMiddleware = require('../../../middlewares/auth');
const authorize = require('../../../middlewares/authorize');

router.put('/:id', authMiddleware, authorize(['ceo', 'admin', 'manager']), async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEmployee = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password -otp -otpExpires');

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
