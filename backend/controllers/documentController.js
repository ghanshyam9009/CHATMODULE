// controllers/documentController.js
const Document = require('../models/Document');
const Assistant = require('../models/Assistant');
const Chat = require('../models/ChatMessage');
const mongoose = require('mongoose');
const { getGFS } = require('../config/gridfs'); // Import getGFS from gridfs config
const { GridFsStorage } = require('multer-gridfs-storage');

const multer = require('multer');
const path = require('path');
const { validationResult } = require('express-validator');

// Configure GridFS Storage with file type and size validation
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: async (req, file) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { assistantId, chatId } = req.body;
                const userId = req.user.id;
                const tenantId = req.user.tenantId;

                if (!assistantId || !chatId) {
                    return reject(new Error('Assistant ID and Chat ID are required.'));
                }

                // Validate assistant
                const assistant = await Assistant.findById(assistantId);
                if (!assistant || assistant.tenantId.toString() !== tenantId) {
                    return reject(new Error('Assistant not found or does not belong to this tenant.'));
                }

                // Validate chat
                const chat = await Chat.findById(chatId);
                if (!chat || chat.tenantId.toString() !== tenantId) {
                    return reject(new Error('Chat not found or does not belong to this tenant.'));
                }

                // Validate file type
                const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain',
                ];
                if (!allowedTypes.includes(file.mimetype)) {
                    return reject(new Error('Only PDF, DOC, DOCX, and TXT files are allowed.'));
                }

                const filename = Date.now() + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads', // Must match the collection name set in GridFS
                };
                resolve(fileInfo);
            } catch (error) {
                reject(error);
            }
        });
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload Document
exports.uploadDocument = (req, res) => {
    upload.single('document')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Other errors
            return res.status(400).json({ message: err.message });
        }

        try {
            const { assistantId, chatId } = req.body;
            const userId = req.user.id;
            const tenantId = req.user.tenantId;

            if (!assistantId || !chatId || !req.file) {
                return res.status(400).json({ message: 'Assistant ID, chat ID, and document are required.' });
            }

            // Save document information with GridFS file ID
            const document = new Document({
                tenantId,
                userId,
                assistantId,
                chatId,
                fileName: req.file.originalname,
                fileId: req.file.id, // Reference to GridFS file
            });

            await document.save();

            res.status(200).json({
                message: 'Document uploaded successfully.',
                document,
            });
        } catch (error) {
            console.error('Error uploading document:', error);
            res.status(500).json({ message: 'Error uploading document.', error: error.message });
        }
    });
};

// Get Documents for a Specific Assistant (User) with Pagination
exports.getUserDocumentsByAssistant = async (req, res) => {
    try {
        const userId = req.user.id;
        const tenantId = req.user.tenantId;
        const { assistantId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!assistantId) {
            return res.status(400).json({ message: 'Assistant ID is required.' });
        }

        // Verify that the assistant belongs to the tenant and the user
        const assistant = await Assistant.findById(assistantId);
        if (!assistant || assistant.tenantId.toString() !== tenantId) {
            return res.status(404).json({ message: 'Assistant not found or does not belong to this tenant.' });
        }

        // Retrieve documents for the given assistant and user with pagination
        const documents = await Document.find({ assistantId, userId, tenantId })
            .sort({ uploadedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Document.countDocuments({ assistantId, userId, tenantId });

        res.status(200).json({
            message: documents.length > 0 ? 'Documents retrieved successfully.' : 'No documents found for this assistant.',
            documents,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error retrieving documents:', error);
        res.status(500).json({ message: 'Error retrieving documents.', error: error.message });
    }
};

// Get Documents by Assistant (Admin Only) with Pagination
exports.getDocumentsByAssistant = async (req, res) => {
    try {
        const { assistantId } = req.params;
        const tenantId = req.user.tenantId;
        const { page = 1, limit = 10 } = req.query;

        if (!assistantId) {
            return res.status(400).json({ message: 'Assistant ID is required.' });
        }

        // Verify that the assistant belongs to the tenant
        const assistant = await Assistant.findById(assistantId);
        if (!assistant || assistant.tenantId.toString() !== tenantId) {
            return res.status(404).json({ message: 'Assistant not found or does not belong to this tenant.' });
        }

        // Retrieve documents for the given assistant and tenant with pagination
        const documents = await Document.find({ assistantId, tenantId })
            .sort({ uploadedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Document.countDocuments({ assistantId, tenantId });

        if (documents.length === 0) {
            return res.status(404).json({ message: 'No documents found for this assistant.' });
        }

        res.status(200).json({
            message: 'Documents retrieved successfully.',
            documents,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error retrieving documents:', error);
        res.status(500).json({ message: 'Error retrieving documents.', error: error.message });
    }
};

// Download Document
exports.downloadDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const userId = req.user.id;
        const tenantId = req.user.tenantId;
        const isAdmin = req.user.isAdmin;

        if (!mongoose.Types.ObjectId.isValid(documentId)) {
            return res.status(400).json({ message: 'Invalid Document ID.' });
        }

        const document = await Document.findById(documentId);

        if (!document) {
            return res.status(404).json({ message: 'Document not found.' });
        }

        // Verify tenant
        if (document.tenantId.toString() !== tenantId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Check access permissions
        if (!isAdmin && document.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const gfs = getGFS();
        if (!gfs) {
            return res.status(500).json({ message: 'File storage not initialized.' });
        }

        // Find the file in GridFS
        const file = await gfs.files.findOne({ _id: document.fileId });

        if (!file) {
            return res.status(404).json({ message: 'File not found in storage.' });
        }

        // Set appropriate headers
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename="${document.fileName}"`);

        // Create read stream and pipe to response
        const readStream = gfs.createReadStream({ _id: document.fileId });
        readStream.pipe(res);
    } catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({ message: 'Error downloading document.', error: error.message });
    }
};
