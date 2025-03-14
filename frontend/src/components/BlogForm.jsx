import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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

  // Handle Thumbnail Upload (Now to Backend Instead of Cloudinary Directly)
  const handleThumbnailChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setThumbnailUrl(response.data.url); // Get URL from backend
      setThumbnail(file);
    } catch (error) {
      console.error("❌ Thumbnail upload failed:", error);
      alert("Thumbnail upload failed!");
    } finally {
      setLoading(false);
    }
  };

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

      <input type="file" accept="image/*" onChange={handleThumbnailChange} className="mt-4" />
      {thumbnailUrl && <img src={thumbnailUrl} alt="Thumbnail Preview" className="mt-4 w-full h-48 object-cover rounded" />}

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
