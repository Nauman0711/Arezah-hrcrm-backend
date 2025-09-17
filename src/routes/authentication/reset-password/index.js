const express = require('express');
const User = require('../../../models/user');
const router = express.Router();
const verifyResetToken = require('../../../middlewares/verify-reset-token');

router.post('/', verifyResetToken, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
        return res.status(400).json({ message: 'New password is required' });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password has been reset successfully', success:true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;