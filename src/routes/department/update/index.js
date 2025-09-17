const express = require("express");
const router = express.Router();
const Department = require("../../../models/department");
const authMiddleware = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");

router.put("/:id", authMiddleware, authorize(["ceo", "admin", "manager"]), async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!department) return res.status(404).json({ message: "Department not found" });

    res.json({ message: "Department updated successfully", department });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
