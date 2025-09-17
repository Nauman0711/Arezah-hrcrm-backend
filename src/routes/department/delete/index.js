const express = require("express");
const router = express.Router();
const Department = require("../../../models/department");
const authMiddleware = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");
const companyScope = require("../../../middlewares/company-scope");

router.delete("/:id", authMiddleware, companyScope, authorize(["ceo"]), async (req, res) => {
  try {
    const department = await Department.findOneAndDelete({
      _id: req.params.id,
      company: req.companyId,
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found or not in your company" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
