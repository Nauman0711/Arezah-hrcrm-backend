const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authMiddleware = require('../../../middlewares/auth');
const authorize = require('../../../middlewares/authorize');

router.post('/', authMiddleware, authorize(['ceo', 'admin', 'manager']), async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        designation,
        address,
        cnicNumber,
        contactNumber,
        emergencyContactNumber,
        joiningDate,
        leavingDate,
        status,
        accountNumber,
        branchCode,
        gender,
        departments,
        type,
        employeeId
    } = req.body;

    try {
        const creatorId = req.user.userId;
        const creator = await User.findById(creatorId);
        if (!creator || !["ceo", "admin", "manager"].includes(creator.type)) {
            return res.status(403).json({ message: "Access denied. Only CEO, Admin, or Manager can add employees." });
        }

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "Email, password, first name, and last name are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const employee = new User({
            email,
            password,
            firstName,
            lastName,
            type,
            designation,
            address,
            cnicNumber,
            contactNumber,
            emergencyContactNumber,
            joiningDate,
            leavingDate,
            status,
            accountNumber,
            branchCode,
            gender,
            departments,
            employeeId
        });

        await employee.save();

        res.status(201).json({
            message: "✅ Employee created successfully",
            employee: {
                _id: employee._id,
                employeeId: employee.employeeId,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                designation: employee.designation,
                status: employee.status
            }
        });

    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
