// models/ChatMessage.js

const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assistantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assistant',
        required: true
    },
    sessionId: {
        type: String, // Unique identifier for the session
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update lastActivity on each save
chatMessageSchema.pre('save', function(next) {
    this.lastActivity = new Date();
    next();
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
