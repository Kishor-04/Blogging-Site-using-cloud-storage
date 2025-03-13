const express = require('express');
const router = express.Router();
const { saveContent, getAllContent,getContentById } = require('../controllers/contentController');

// ✅ Define Routes
router.post('/save', saveContent);
router.get('/content', getAllContent);
router.get('/content/:id', getContentById);


module.exports = router;
