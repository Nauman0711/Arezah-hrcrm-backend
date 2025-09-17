const express = require("express");
const router = express.Router();
const Department = require("../../../models/department");
const User = require("../../../models/user");
const authMiddleware = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");

router.get("/:id", authMiddleware, authorize(["ceo"]), async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId).select("company");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const department = await Department.findOne({
      _id: req.params.id,
      company: currentUser.company,
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found or not in your company" });
    }
    res.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
