const express = require('express');
const router = express.Router();
const { saveContent, getAllContent,getContentById,updateBlog, deleteBlog } = require('../controllers/contentController');

// ✅ Define Routes
router.post('/save', saveContent);
router.get('/content', getAllContent);
router.get('/content/:id', getContentById);
router.put("/content/:id", updateBlog);
router.delete("/content/:id", deleteBlog);

module.exports = router;
