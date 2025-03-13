const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Thumbnail is required' });

    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: 'blog-thumbnails' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Cloudinary Upload Failed' });

        const newBlog = new Blog({ title, content, thumbnail: result.secure_url });
        await newBlog.save();
        res.status(201).json(newBlog);
      }
    ).end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    await cloudinary.uploader.destroy(blog.thumbnail);
    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
