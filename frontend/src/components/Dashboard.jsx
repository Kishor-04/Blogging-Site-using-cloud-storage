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
              className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105"
              onClick={() => navigate(`/blog/${content._id}`)}
            >
              <img src={content.thumbnailUrl} alt="Thumbnail" className="w-full h-32 object-cover rounded mb-4" />
              <h3 className="text-xl font-bold">{content.title}</h3>
              <p className="text-gray-500 text-sm mt-1">🕒 {new Date(content.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
