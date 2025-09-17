const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../../../models/user');

router.post('/', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'Email, password, first name, and last name are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            type: "ceo"
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

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

        res.status(201).json({ message: 'User registered successfully. Verification OTP sent to email.' });

    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
