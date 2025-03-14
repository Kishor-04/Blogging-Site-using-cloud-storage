const Content = require('../models/Content');
const cloudinary = require("../config/cloudinaryConfig");

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
// Update a blog
const updateBlog = async (req, res) => {
    try {
      const { title, htmlContent, thumbnailUrl } = req.body;
      const updatedBlog = await Content.findByIdAndUpdate(
        req.params.id,
        { title, htmlContent, thumbnailUrl },
        { new: true }
      );
  
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json(updatedBlog);
    } catch (error) {
      console.error("❌ Error updating blog:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  // Delete a blog and its image from Cloudinary
 const deleteBlog = async (req, res) => {
    try {
      const blog = await Content.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      // Delete the image from Cloudinary
      const imageUrl = blog.thumbnailUrl;
      const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public_id from URL
      await cloudinary.uploader.destroy(publicId);
  
      await Content.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting blog:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

module.exports = { saveContent, getAllContent, getContentById ,updateBlog,deleteBlog};