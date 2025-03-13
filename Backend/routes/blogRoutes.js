const express = require('express');
const { createBlog, getBlogs, getBlogById, deleteBlog } = require('../controllers/blogController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/blogs', upload.single('thumbnail'), createBlog);
router.get('/blogs', getBlogs);
router.get('/blogs/:id', getBlogById);
router.delete('/blogs/:id', deleteBlog);

module.exports = router;
