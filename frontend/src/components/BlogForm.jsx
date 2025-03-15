import React, { useState, useEffect ,useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";


export default function BlogForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is editing an existing blog
  const isEditing = location.state?.isEditing || false;
  const [title, setTitle] = useState(location.state?.title || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(location.state?.thumbnailUrl || "");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
    }
  }, [isEditing]);

  // Upload Image to Backend
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setThumbnailUrl(response.data.url); // Set the uploaded image URL
    } catch (error) {
      console.error("❌ Thumbnail upload failed:", error);
      alert("Thumbnail upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      alert("Invalid file type. Please upload an image.");
      return;
    }
    const file = acceptedFiles[0];
    setThumbnail(file);
    setThumbnailUrl(URL.createObjectURL(file)); // Preview the image
    uploadImage(file); // Upload to Cloudinary
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"]
    },
    onDrop, // ✅ Use existing `onDrop` function
  });
  
  
  
  //handle next button
  const handleNext = () => {
    if (!thumbnailUrl || !title.trim()) {
      alert("Please upload a thumbnail and enter a title!");
      return;
    }
    navigate("/editor", { state: { thumbnailUrl, title, isEditing, _id: location.state?._id } });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center">{isEditing ? "Edit Blog" : "Upload Blog Thumbnail"}</h2>

       {/* Drag & Drop or Click to Upload */}
       <div
        {...getRootProps()}
        className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-48 object-cover rounded" />
        ) : (
          <p className="text-gray-600">{isDragActive ? "Drop the image here..." : "Drag & drop an image here, or click to select one"}</p>
        )}
      </div>

      <input
        type="text"
        className="w-full p-2 mt-4 border rounded"
        placeholder="Enter Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        onClick={handleNext}
        className={`mt-4 w-full p-2 rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        disabled={loading}
      >
        {isEditing ? "Edit Blog" : "Continue to Editor"}
      </button>
    </div>
  );
}
