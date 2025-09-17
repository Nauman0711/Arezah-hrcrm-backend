module.exports = function authorize(types = []) {
    return (req, res, next) => {
        if (!types.includes(req.user.type)) {  // ✅ use type
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};
