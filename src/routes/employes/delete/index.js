const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authMiddleware = require('../../../middlewares/auth');
const authorize = require('../../../middlewares/authorize');

router.delete('/:id', authMiddleware, authorize(['ceo', 'admin', 'manager']), async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmployee = await User.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
