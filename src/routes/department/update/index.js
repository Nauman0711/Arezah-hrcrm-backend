const express = require("express");
const router = express.Router();
const Department = require("../../../models/department");
const authMiddleware = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");
const companyScope = require("../../../middlewares/company-scope");

router.put("/:id", authMiddleware, companyScope, authorize(["ceo"]), async (req, res) => {
  try {
    const department = await Department.findOneAndUpdate(
      { _id: req.params.id, company: req.companyId },
      { name: req.body.name, description: req.body.description },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found or not in your company" });
    }

    res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
