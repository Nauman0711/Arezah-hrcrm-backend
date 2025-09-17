const jwt = require('jsonwebtoken');

const verifyResetToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Make decoded token info available in route
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyResetToken;
