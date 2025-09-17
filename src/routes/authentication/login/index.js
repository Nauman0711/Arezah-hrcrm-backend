const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    const { email, password, fcmToken } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email }).populate('company').populate('departments');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // if (!user.isVerified) {
        //     return res.status(403).json({ message: 'Your account is not verified. Please verify before logging in.' });
        // }

        if (fcmToken) {
            user.fcmToken = fcmToken;
            await user.save();
        }
        const token = jwt.sign(
            { userId: user._id, type: user.type },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );
        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                type: user.type,
                profilePhoto: user.profilePhoto,
                designation: user.designation,
                status: user.status,
                departments: user.departments,
                employeeId: user.employeeId,
                joiningDate: user.joiningDate,
                leavingDate: user.leavingDate,
                comapny: user.company
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
