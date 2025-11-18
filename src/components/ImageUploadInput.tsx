import { supabase } from '@/integrations/supabase/client';
import React, { useRef, useState } from 'react';

const ImageUploadInput = ({ image, setImage, label }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = async (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Generate unique filename
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const fileName = `image_${timestamp}_${randomString}.${extension}`;
      const filePath = `images/${fileName}`;

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setImage(publicUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    setError('');
    setImage(e.target.value);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          {label || 'Image'}
        </label>
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {/* URL input */}
      <input
        type="url"
        id="image"
        value={image}
        onChange={handleUrlChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="https://example.com/image.jpg or upload a file"
        disabled={uploading}
      />

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Image preview */}
      {image && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Preview:</p>
          <img
            src={image}
            alt="Preview"
            className="max-w-full h-20 object-cover rounded border border-gray-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Upload info */}
      <p className="text-xs text-gray-500">
        Enter a URL or click "Upload Image" to upload from your device
      </p>
    </div>
  );
};

export default ImageUploadInput;