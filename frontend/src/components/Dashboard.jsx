import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [contentList, setContentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/content`);
        setContentList(res.data);
      } catch (error) {
        console.error("❌ Error fetching content:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">📖 Dashboard</h2>

      {contentList.length === 0 ? (
        <p className="text-center text-gray-500">No blogs available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentList.map((content) => (
            <div
              key={content._id}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <img
                src={content.thumbnailUrl}
                alt="Thumbnail"
                className="w-full h-40 object-cover rounded mb-4 cursor-pointer"
                onClick={() => navigate(`/blog/${content._id}`)} // Navigate to blog page
              />
              <h3 className="text-xl font-bold">{content.title}</h3>
              <p className="text-gray-500 text-sm mt-1">🕒 {new Date(content.createdAt).toLocaleString()}</p>

              {/* Button Container */}
              <div className="mt-4 flex justify-between">
                {/* Edit Button */}
                <button
                  onClick={() => navigate("/", { state: { ...content, isEditing: true } })}
                  className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
                >
                  ✏️ Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this blog?")) {
                      try {
                        await axios.delete(`${import.meta.env.VITE_API_URL}/content/${content._id}`);
                        setContentList(contentList.filter((c) => c._id !== content._id));
                        alert("Blog deleted successfully!");
                      } catch (error) {
                        console.error("❌ Error deleting blog:", error);
                        alert("Failed to delete blog.");
                      }
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
