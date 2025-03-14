import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function TextEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { _id, title, thumbnailUrl, isEditing } = location.state || {}; // ✅ Get `_id` and `isEditing`
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!thumbnailUrl || !title) {
    return <p className="text-center text-gray-500 text-lg mt-10">No Thumbnail or Title Found!</p>;
  }

  useEffect(() => {
    if (isEditing && _id) {
      // ✅ Fetch existing blog content if editing
      const fetchContent = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/content/${_id}`);
          setContent(res.data.htmlContent);
          localStorage.setItem(`editorContent_${_id}`, res.data.htmlContent); // Save to localStorage
        } catch (error) {
          console.error("❌ Error fetching blog:", error);
        }
      };
      fetchContent();
    } else {
      // ✅ Load from localStorage if available
      const savedContent = localStorage.getItem(`editorContent_${_id}`);
      if (savedContent) {
        setContent(savedContent);
      }
    }
  }, [_id, isEditing]);

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    localStorage.setItem(`editorContent_${_id}`, newContent);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isEditing) {
        // ✅ Update existing blog
        await axios.put(`${import.meta.env.VITE_API_URL}/content/${_id}`, {
          title,
          htmlContent: content,
          thumbnailUrl,
        });
        alert("✅ Blog updated successfully!");
      } else {
        // ✅ Create new blog
        await axios.post(`${import.meta.env.VITE_API_URL}/save`, {
          title,
          htmlContent: content,
          thumbnailUrl,
        });
        alert("✅ Blog saved successfully!");
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error saving blog:", error);
      alert("Failed to save blog. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mt-4 text-center">{title}</h2>
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            plugins:
              'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | alignleft aligncenter alignright lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            // ✅ Add alignment options for images
            contextmenu: 'link image table',
            image_caption: true,
            image_description: false,
            image_advtab: true,
            branding: false,

            image_class_list: [
              { title: 'None', value: '' },
              { title: 'Align Left', value: 'align-left' },
              { title: 'Align Center', value: 'align-center' },
              { title: 'Align Right', value: 'align-right' }
            ],
        
            content_style: `
              .align-left { float: left; margin-right: 10px; }
              .align-center { display: block; margin: 0 auto; }
              .align-right { float: right; margin-left: 10px; }
            `,
            
            images_upload_handler: async (blobInfo, success, failure) => {
              const formData = new FormData();
              formData.append('file', blobInfo.blob());

              try {
                const response = await axios.post(
                  `${import.meta.env.VITE_API_URL}/upload/editor-image`,
                  formData
                );

                if (!response.data || !response.data.secure_url) {
                  throw new Error("Invalid image upload response");
                }

                success(response.data.secure_url);
              } catch (error) {
                console.error('❌ Image upload failed:', error);
                failure('Image upload failed. Try again.');
              }
            },
            file_picker_types: 'image',
            image_title: true,
            automatic_uploads: true,
            file_picker_callback: (cb, value, meta) => {
              if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');

                input.onchange = async function () {
                  const file = this.files[0];
                  const formData = new FormData();
                  formData.append('file', file);

                  try {
                    const response = await axios.post(
                      `${import.meta.env.VITE_API_URL}/upload/editor-image`,
                      formData
                    );

                    if (!response.data || !response.data.secure_url) {
                      throw new Error("Invalid file picker response");
                    }

                    cb(response.data.secure_url, { title: file.name });
                  } catch (error) {
                    console.error('❌ File picker upload failed:', error);
                    alert("Failed to upload image. Try again.");
                  }
                };
                input.click();
              }
            }
          }}
        />
      </div>
      <button
        onClick={handleSave}
        className={`mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
        disabled={loading}
      >
        {loading ? "Saving..." : isEditing ? "Update Content" : "Save Content"}
      </button>
    </div>
  );
}
