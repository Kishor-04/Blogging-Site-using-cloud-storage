const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    htmlContent: { type: String, required: true }, // Stores full HTML content
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);
