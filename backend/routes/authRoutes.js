const express = require('express');
const { register, login, getUsersByTenant, logout } = require('../controllers/authController');
const { adminOnly } = require('../middlewares/admin');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

router.get('/tenant/:tenantId/users', authMiddleware, adminOnly, getUsersByTenant);

router.post('/register', register); // User registration route
router.post('/login', login); // User login route
router.post('/logout', authMiddleware, logout); // Logout route

module.exports = router;
