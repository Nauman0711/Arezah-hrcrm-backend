const express = require("express");
const router = express.Router();
const Department = require("../../models/department");
const authMiddleware = require("../../middlewares/auth");
const companyScope = require("../../middlewares/company-scope");

router.get("/", authMiddleware, companyScope, async (req, res) => {
    try {
        const departments = await Department.find({ company: req.companyId });
        if (req.user.type === 'employee') {
            res.json({
                status: 'active',
                activeStatus: 'active'
            });
        } else {
            res.json({
                departments,
                status: 'active',
                activeStatus: 'active',
                totalUser: 100,
                activeMember: 20,
                offlineMember: 80,
                leavesMember: 30
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
