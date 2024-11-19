// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assistantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assistant', required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    fileName: { type: String, required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to GridFS file
    uploadedAt: { type: Date, default: Date.now },
});

// Create indexes for faster queries
documentSchema.index({ tenantId: 1, userId: 1, assistantId: 1 });
documentSchema.index({ fileId: 1 });

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
