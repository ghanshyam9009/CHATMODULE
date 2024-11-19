const express = require('express');
const { adminOnly } = require('../middlewares/admin');
const { getUserAssistants, createAssistant } = require('../controllers/assistantController');
const { getUserAssistantsForAdmin } = require('../controllers/assistantController'); // Import the new controller
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createAssistant); // Apply middleware for authentication
router.get('/user-assistants', authMiddleware, getUserAssistants);
router.get('/admin/:userId', authMiddleware, adminOnly, getUserAssistantsForAdmin); // Use the new controller


module.exports = router;
