const express = require('express');
const User = require('../../../models/user');
const nodemailer = require('nodemailer');
const router = express.Router();


router.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send email (use nodemailer)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: email,
            subject: 'Your OTP Code',
            html: `<p>Your OTP is: <strong>${otp}</strong></p>`
        });

        res.json({ message: 'OTP sent to email', success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;