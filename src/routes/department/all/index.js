const express = require("express");
const router = express.Router();
const Department = require("../../../models/department");
const authMiddleware = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");
router.get("/", authMiddleware, async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
