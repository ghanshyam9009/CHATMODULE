// models/Assistant.js

const mongoose = require('mongoose');

const assistantSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true, // Associate assistant with a tenant
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Associate assistant with a user
    },
    name: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        default: 'gpt-4', // Default to GPT-4
    },
    openAIId: {
        type: String, // Store OpenAI's assistant ID
        required: true,
    },
    instructions: {
        type: String, // Store the instructions sent to OpenAI
        required: true,
    },
    tools: {
        type: [String], // Store tools if used (e.g., code interpreter)
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Assistant', assistantSchema);
