const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../../../models/user');
const Company = require("../../../models/company");
const bcrypt = require("bcryptjs");

router.post('/', async (req, res) => {
    const { email, password, firstName, lastName, companyName } = req.body;
    try {
        if (!email || !password || !firstName || !lastName || !companyName) {
            return res.status(400).json({ message: 'All fields are required' });
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
        // await user.save();

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
        // Step 2: Create company and assign owner
        const company = new Company({
            name: companyName,
            owner: user._id
        });
        await company.save();

        // Step 3: Update user with company reference
        user.company = company._id;
        await user.save();

        res.status(201).json({
            message: "CEO and company registered successfully",
            user,
            company
        });

        res.status(201).json({ message: 'User registered successfully. Verification OTP sent to email.' });

    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
