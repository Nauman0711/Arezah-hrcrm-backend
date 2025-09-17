const express = require("express");
const router = express.Router();
const Department = require("../../../models/department");
const User = require("../../../models/user"); // ✅ you forgot to import this
const authMiddleware = require("../../../middlewares/auth");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId).select("company");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const departments = await Department.find({ company: currentUser.company });
    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
