// resources/js/pages/Backend/CMS/Shared/Modals/StoriesEditor.jsx

import React, { useState } from 'react';
import { FaPlus, FaTrash, FaUpload, FaXmark } from 'react-icons/fa6';
import Swal from 'sweetalert2';

export default function StoriesEditor({
  formData,
  updateFormData,
  addArrayItem,
  removeArrayItem,
  isLoading = false,
  setIsLoading = null
}) {
  const [dragActive, setDragActive] = useState({});
  const [uploading, setUploading] = useState({});

  // Check if any upload is in progress
  const isUploading = Object.values(uploading).some(status => status === true);
  const isDisabled = isLoading || isUploading;

  // Handle drag and drop for images
  const handleDrag = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [index]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [index]: false }));

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processImageFile(file, index);
    }
  };

  const handleFileSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file, index);
    }
    e.target.value = '';
  };

  const processImageFile = (file, index) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, GIF, WebP, SVG)',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size should be less than 5MB',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setUploading(prev => ({ ...prev, [index]: true }));
    if (setIsLoading) setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateFormData(`stories.${index}.image`, imageUrl);
      setUploading(prev => ({ ...prev, [index]: false }));
      if (setIsLoading) setIsLoading(false);
    };
    reader.onerror = () => {
      setUploading(prev => ({ ...prev, [index]: false }));
      if (setIsLoading) setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    updateFormData(`stories.${index}.image`, '');
  };

  const getDisplayPath = (src) => {
    if (!src) return '';
    if (src.startsWith('data:image')) {
      return 'New image (will be uploaded)';
    }
    return src;
  };

  return (
    <div className="space-y-4 w-full">
      {/* Section Title and Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Title</label>
          <input
            type="text"
            value={formData.section?.title || ''}
            onChange={(e) => updateFormData('section.title', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isDisabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Description</label>
          <textarea
            value={formData.section?.description || ''}
            onChange={(e) => updateFormData('section.description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isDisabled}
          />
        </div>
      </div>

      {/* Stories List */}
      <h3 className="font-semibold text-lg pt-4">Stories</h3>
      {(formData.stories || []).map((story, index) => (
        <div key={story.id || index} className="bg-gray-50 p-4 rounded-lg space-y-3 border-l-4 border-blue-300 w-full">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Story #{index + 1}</span>
            <button
              type="button"
              onClick={() => removeArrayItem('stories', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
              disabled={isDisabled}
            >
              <FaTrash size={14} />
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-3 transition-all ${dragActive[index] ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                } ${uploading[index] ? 'opacity-50' : ''}`}
              onDragEnter={(e) => handleDrag(e, index)}
              onDragLeave={(e) => handleDrag(e, index)}
              onDragOver={(e) => handleDrag(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              {story.image ? (
                <div className="flex items-center gap-3">
                  <img
                    src={story.image}
                    alt={story.title || 'Story image'}
                    className="w-16 h-12 object-cover rounded border border-gray-200"
                  />
                  <span className="text-xs text-gray-500 truncate flex-1">
                    {getDisplayPath(story.image)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                    disabled={isDisabled}
                  >
                    <FaXmark size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-400">
                  <FaUpload size={18} />
                  <span className="text-sm">Drop image or click to browse</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, index)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isDisabled}
              />
              {uploading[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                </div>
              )}
            </div>
          </div>

          {/* Story Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={story.date || ''}
              onChange={(e) => updateFormData(`stories.${index}.date`, e.target.value)}
              placeholder="Date (e.g., June 6, 2023)"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isDisabled}
            />
            <input
              type="text"
              value={story.title || ''}
              onChange={(e) => updateFormData(`stories.${index}.title`, e.target.value)}
              placeholder="Story Title"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isDisabled}
            />
          </div>
          <textarea
            value={story.description || ''}
            onChange={(e) => updateFormData(`stories.${index}.description`, e.target.value)}
            placeholder="Story Description"
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isDisabled}
          />
          <input
            type="text"
            value={story.link || ''}
            onChange={(e) => updateFormData(`stories.${index}.link`, e.target.value)}
            placeholder="Link URL (e.g., /stories/example)"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isDisabled}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('stories', {
          id: Date.now(),
          image: '',
          date: '',
          title: '',
          description: '',
          link: ''
        })}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        disabled={isDisabled}
      >
        <FaPlus size={14} /> Add Story
      </button>
    </div>
  );
}