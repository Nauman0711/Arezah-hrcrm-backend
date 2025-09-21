const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authMiddleware = require('../../../middlewares/auth');
const authorize = require('../../../middlewares/authorize');
const companyScope = require('../../../middlewares/company-scope');

router.get('/', authMiddleware, companyScope, authorize(['ceo', 'admin', 'manager']), async (req, res) => {
    try {
        const { departmentId } = req.query;
        const filter = { type: 'employee', company: req.companyId };
        if (departmentId) {
            filter.departments = departmentId; // if it's a single dept ref
            // OR use $in if employees can belong to multiple departments:
            // filter.departments = { $in: [departmentId] };
        }
        const employees = await User.find(filter).select('-password -otp -otpExpires').populate('departments');
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
