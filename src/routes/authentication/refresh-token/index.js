const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { token } = req.body; // client sends the expired token
  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    // First decode without caring about expiration
    const decoded = jwt.verify(token, process.env.SECRET_KEY, { ignoreExpiration: true });

    // Now check if it's actually expired or invalid
    try {
      jwt.verify(token, process.env.SECRET_KEY); // will throw if expired
      return res.status(400).json({ message: "Token is still valid, no need to refresh" });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        // Issue a new token since the old one is expired but valid
        const newToken = jwt.sign(
          { userId: decoded._id, type: decoded.type, company: decoded.company._id},
          process.env.SECRET_KEY,
          { expiresIn: "24h" }
        );
        return res.status(200).json({ accessToken: newToken });
      } else {
        return res.status(403).json({ message: "Invalid token" });
      }
    }
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

module.exports = router;
