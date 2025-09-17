const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../../../models/user');
const router = express.Router();
router.post('/', async (req, res) => {
    const { email, otp, type } = req.body;
    
    try {
        if (!email || !otp || !type) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (
            !user ||
            user.otp !== otp ||
            !user.otpExpires ||
            user.otpExpires < Date.now()
        ) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP after successful match
        user.otp = undefined;
        user.otpExpires = undefined;
        if (type == 'signUp') {
            user.isVerified = true;
        }
        await user.save();

        // Issue a temporary token for password reset (15 mins)        
        if (type == 'resetPassword') {
            const tempToken = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.SECRET_KEY,
                { expiresIn: '15m' }
            );
            res.json({
                message: 'OTP verified successfully',
                token: tempToken,
                success: true,
                type
            });
        } else if(type == 'signUp'){
            res.json({
                message: 'OTP verified successfully',
                success: true,
                type
            });
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;