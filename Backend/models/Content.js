const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    thumbnailUrl: { type: String, required: true },
    title: { type: String, required: true },
    htmlContent: { type: String, required: true }, // Stores full HTML content
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);
