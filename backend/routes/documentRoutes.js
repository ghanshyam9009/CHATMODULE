// routes/DocumentRoutes.js
const express = require('express');
const { adminOnly } = require('../middlewares/admin');
const {
    getUserDocumentsByAssistant,
    getDocumentsByAssistant,
    uploadDocument,
    downloadDocument,
} = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, param, query, validationResult } = require('express-validator'); // For validation
const router = express.Router();

// Validation Middleware
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};

// Route for uploading a document with validation
router.post(
    '/upload',
    authMiddleware,
    validate([
        body('assistantId').isMongoId().withMessage('Valid assistantId is required.'),
        body('chatId').isMongoId().withMessage('Valid chatId is required.'),
    ]),
    uploadDocument
);

// Route for downloading a document with validation
router.get(
    '/download/:documentId',
    authMiddleware,
    validate([
        param('documentId').isMongoId().withMessage('Valid documentId is required.'),
    ]),
    downloadDocument
);

// User routes with validation
// Changed from GET '/' to GET '/assistant/:assistantId' to enforce assistant scope
router.get(
    '/assistant/:assistantId',
    authMiddleware,
    validate([
        param('assistantId').isMongoId().withMessage('Valid assistantId is required.'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer.'),
    ]),
    getUserDocumentsByAssistant
);

// Admin routes with validation
router.get(
    '/admin/assistant/:assistantId',
    authMiddleware,
    adminOnly,
    validate([
        param('assistantId').isMongoId().withMessage('Valid assistantId is required.'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer.'),
    ]),
    getDocumentsByAssistant
);

module.exports = router;
