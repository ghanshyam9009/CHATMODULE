// middlewares/admin.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.adminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id); // Assuming req.user.id is populated correctly

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next(); // User is an admin, proceed to the next middleware
    } catch (error) {
        console.error('Admin authorization error:', error);
        res.status(500).json({ message: 'Server error during admin authorization.' });
    }
};
