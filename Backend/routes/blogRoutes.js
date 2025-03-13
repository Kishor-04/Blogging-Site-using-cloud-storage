const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const blogController = require('../controllers/blogController');

router.post('/blogs', upload.single('thumbnail'), blogController.createBlog);
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id', blogController.getBlogById);

module.exports = router;
