const express = require("express");
const router = express.Router();
const User = require("../../../models/user");
const authMiddleware = require("../../../middlewares/auth");

router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        await User.findByIdAndUpdate(userId, { $unset: { fcmToken: "" } });
        res.json({ success: true, message: "Logged out successfully!" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Failed to logout" });
    }
});

module.exports = router;
