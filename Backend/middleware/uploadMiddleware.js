const cloudinary = require("../config/cloudinaryConfig");
const streamifier = require("streamifier");

const uploadThumbnailImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let fileName = req.file.originalname.split(".")[0].trim(); // Trim filename to remove spaces

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Thumbnail",
            public_id: fileName, // Ensure trimmed filename
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    req.uploadedUrl = result.secure_url;
    req.fileName = result.public_id;
    next();
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};

const uploadEditorImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let fileName = req.file.originalname.split(".")[0].trim(); // Trim filename

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "TextEditorImages",
            public_id: fileName,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();
    
    if (!result.secure_url) {
      return res.status(500).json({ error: "Image upload failed, no secure URL returned" });
    }

    res.json({ secure_url: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};

module.exports = { uploadThumbnailImage, uploadEditorImage };
