const express = require("express");
const router = express.Router();
const Department = require("../../../models/department");
const authMiddleware = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");

router.post("/", authMiddleware, authorize(["ceo", "admin", "manager"]), async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Department name is required" });
        }

        const existing = await Department.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Department already exists" });
        }

        const department = new Department({ name, description });
        await department.save();

        res.status(201).json({ message: "Department created successfully", department });
    } catch (error) {
        console.error("❌ Error creating department:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
