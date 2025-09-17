const express = require("express");
const router = express.Router();
const Department = require("../../../models/department");
const authMiddleware = require("../../../middlewares/auth");

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
