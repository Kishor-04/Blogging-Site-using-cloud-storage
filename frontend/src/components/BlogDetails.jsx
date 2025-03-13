import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BlogDetails() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/content/${id}`);
                setBlog(res.data);
            } catch (error) {
                console.error("❌ Error fetching blog:", error);
            }
        };
        fetchBlog();
    }, [id]);

    if (!blog) return <p className="text-center text-gray-500 text-lg mt-10">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-12">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-xl p-8">
                
                {/* Blog Title */}
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                    {blog.title || "Untitled Blog"}
                </h2>

                {/* Timestamp */}
                <p className="text-gray-500 text-sm mb-6">🕒 {new Date(blog.createdAt).toLocaleString()}</p>

                {/* Blog Content with Image Styling */}
                <div 
                    className="prose lg:prose-lg text-gray-700 leading-relaxed max-w-full"
                    dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
                />

                {/* Ensuring Images are Responsive */}
                <style>
                    {`
                        .prose img {
                            max-width: 100%;
                            height: auto;
                            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                            margin-top: 16px;
                            margin-bottom: 16px;
                        }
                    `}
                </style>
            </div>
        </div>
    );
}
