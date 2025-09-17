const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authMiddleware = require('../../../middlewares/auth');
const authorize = require('../../../middlewares/authorize');

router.delete('/:id', authMiddleware, authorize(['ceo']), async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = await User.findById(req.user.userId).select("company");
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const deletedEmployee = await User.findByIdAndDelete({ _id: id, company: currentUser.company });
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
