// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const { sendMessage, getUserChats, getAssistantChats, endChatSession } = require('../controllers/chatController');
const { adminOnly } = require('../middlewares/admin');
const authMiddleware = require('../middlewares/authMiddleware');

// Send a message
router.post('/send', authMiddleware, sendMessage);

// Get user chats for a specific assistant and session
router.get('/user/:assistantId/:sessionId', authMiddleware, getUserChats);

// Get assistant chats (admin access)
router.get('/assistant/:assistantId/:sessionId', authMiddleware, adminOnly, getAssistantChats);

// End a chat session
router.post('/end', authMiddleware, endChatSession);

module.exports = router;

