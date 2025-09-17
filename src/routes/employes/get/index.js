const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authMiddleware = require('../../../middlewares/auth');
const companyScope = require('../../../middlewares/company-scope');

router.get('/:id', authMiddleware, companyScope, async (req, res) => {
    try {
        const requestedId = req.params.id;
        const { userId, type } = req.user;
        if (
            ['ceo', 'admin', 'manager'].includes(type) ||
            (type === 'employee' && userId === requestedId)
        ) {
            const user = await User.findById(requestedId).select('-password -otp -otpExpires');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(user);
        }

        return res.status(403).json({ message: 'Access denied' });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
