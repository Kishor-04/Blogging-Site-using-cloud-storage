import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

export default function TextEditor() {
  // ✅ State to manage content
  const [content, setContent] = useState('');

  // ✅ Load content from localStorage when component mounts
  useEffect(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  // ✅ Function to handle content change
  const handleEditorChange = (newContent) => {
    setContent(newContent);
    localStorage.setItem('editorContent', newContent); // Save to localStorage
  };

  return (
    <Editor
      apiKey="et7or7bsvy849389p2m0bhfrwtiz8s69ps0phg8sdhnr2emi"
      value={content} // Load saved content
      onEditorChange={handleEditorChange} // Save content on change
      init={{
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        branding: false,
        file_picker_types: 'file image media',
        image_title: true,
        automatic_uploads: true,

        // ✅ Upload Image to Cloudinary
        file_picker_callback: (cb, value, meta) => {
          if (meta.filetype === 'image') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = async function () {
              const file = this.files[0];
              const formData = new FormData();
              formData.append('file', file);
              formData.append('upload_preset', 'cloudinary'); // Change this
              formData.append('cloud_name', 'dy5lpmocq'); // Change this

              try {
                const response = await axios.post(
                  'https://api.cloudinary.com/v1_1/dy5lpmocq/image/upload', // Change this
                  formData
                );

                // ✅ Insert Cloudinary image URL into TinyMCE editor
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
