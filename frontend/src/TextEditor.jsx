import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

export default function TextEditor() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    localStorage.setItem('editorContent', newContent);
  };

  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY} // ✅ Securely using Vite env variables
      value={content}
      onEditorChange={handleEditorChange}
      init={{
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        branding: false,
        file_picker_types: 'file image media',
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
              formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
              formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

              try {
                const response = await axios.post(
                  `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                  formData
                );
                cb(response.data.secure_url, { title: file.name });
              } catch (error) {
                console.error('Image upload failed:', error);
              }
            };
            input.click();
          }
        }
      }}
    />
  );
}
