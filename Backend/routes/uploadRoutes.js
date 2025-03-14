const express = require("express");
const upload = require("../middleware/multerConfig");
const {uploadThumbnailImage,uploadEditorImage} = require("../middleware/uploadMiddleware");

const router = express.Router();

// ✅ Upload Route
router.post("/", upload.single("file"), uploadThumbnailImage, (req, res) => {
  res.json({ url: req.uploadedUrl });
});

// ✅ Text Editor Image Upload Route
router.post("/editor-image", upload.single("file"), uploadEditorImage, (req, res) => {
  res.json({ url: req.uploadedUrl });
});

module.exports = router;
