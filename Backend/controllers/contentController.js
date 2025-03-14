const Content = require('../models/Content');

// ✅ Save Content (Updated)
const saveContent = async (req, res) => {
    try {
        const { title, htmlContent, thumbnailUrl } = req.body;
        const newContent = new Content({ title, htmlContent, thumbnailUrl });

        const savedContent = await newContent.save(); // Save and return the saved document
        res.status(201).json(savedContent); // Send full content with _id and createdAt
    } catch (error) {
        res.status(500).json({ error: 'Error saving content' });
    }
};


// ✅ Fetch All Content (Updated)
const getAllContent = async (req, res) => {
    try {
        const content = await Content.find({}, "_id title thumbnailUrl createdAt").sort({ createdAt: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching content' });
    }
};

// ✅ Fetch Single Content by ID
const getContentById = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ error: "Content not found" });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: "Error fetching content" });
    }
};

module.exports = { saveContent, getAllContent, getContentById };