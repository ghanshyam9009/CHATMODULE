const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure tenant names are unique
        lowercase: true, // Store tenant names in lowercase for case-insensitivity
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Tenant', tenantSchema);
