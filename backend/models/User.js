const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
userSchema.index({ username: 1, tenantId: 1 }, { unique: true }); // Unique constraint on username and tenantId

module.exports = mongoose.model('User', userSchema);
