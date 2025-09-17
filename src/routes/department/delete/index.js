const express = require("express");
const router = express.Router();
const Department = require("../../../models/department");
const authMiddleware = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");

router.delete("/:id", authMiddleware, authorize(["ceo", "admin"]), async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
