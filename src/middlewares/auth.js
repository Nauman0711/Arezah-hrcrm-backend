const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Get token from the header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Add user info to request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(498).json({ message: 'Token expired, please log in again' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    } else {
      return res.status(401).json({ message: 'Token error, authorization denied' });
    }
  }
};

module.exports = authMiddleware;