// resources/js/pages/Backend/CMS/Shared/Modals/TopBarEditor.jsx

// react
import { useState } from 'react';

// icons
import { FaTimes } from 'react-icons/fa';
import { FaPlus, FaTrash, FaUpload } from 'react-icons/fa6';

// sweetalert
import Swal from 'sweetalert2';

export default function TopBarEditor({
  formData,
  updateFormData,
  addArrayItem,
  removeArrayItem,
  isLoading = false,
  setIsLoading = null
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState({});

  // Check if any upload is in progress
  const isUploading = Object.values(uploading).some(status => status === true);

  // Handle drag and drop for images
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e, langIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please drop an image file (JPEG, PNG, GIF, WebP, SVG)',
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

      setUploading(prev => ({ ...prev, [langIndex]: true }));

      // Notify parent about loading state
      if (setIsLoading) setIsLoading(true);

      try {
        // Convert to base64 for preview and upload
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          // Update with base64 - backend will handle upload
          updateFormData(`languages.${langIndex}.flag`, imageUrl);
          setUploading(prev => ({ ...prev, [langIndex]: false }));
          if (setIsLoading) setIsLoading(false);
        };
        reader.onerror = () => {
          setUploading(prev => ({ ...prev, [langIndex]: false }));
          if (setIsLoading) setIsLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to read the image file',
            confirmButtonColor: '#3b82f6',
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploading(prev => ({ ...prev, [langIndex]: false }));
        if (setIsLoading) setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Failed to upload the image. Please try again.',
          confirmButtonColor: '#3b82f6',
        });
      }
    }
  };

  // Handle file input change
  const handleFileSelect = (e, langIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, GIF, WebP, SVG)',
        confirmButtonColor: '#3b82f6',
      });
      e.target.value = '';
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
      e.target.value = '';
      return;
    }

    setUploading(prev => ({ ...prev, [langIndex]: true }));
    if (setIsLoading) setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateFormData(`languages.${langIndex}.flag`, imageUrl);
      setUploading(prev => ({ ...prev, [langIndex]: false }));
      if (setIsLoading) setIsLoading(false);
    };
    reader.onerror = () => {
      setUploading(prev => ({ ...prev, [langIndex]: false }));
      if (setIsLoading) setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Remove flag image
  const removeFlag = (index) => {
    updateFormData(`languages.${index}.flag`, '');
  };

  return (
    <div className="space-y-4 w-full">
      <h3 className="font-semibold text-lg">Contact Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="text"
            value={formData.contactInfo?.email?.text || ''}
            onChange={(e) => updateFormData('contactInfo.email.text', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={formData.contactInfo?.phone?.text || ''}
            onChange={(e) => updateFormData('contactInfo.phone.text', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hours</label>
          <input
            type="text"
            value={formData.contactInfo?.hours?.text || ''}
            onChange={(e) => updateFormData('contactInfo.hours.text', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Languages Section - Can add/remove */}
      <h3 className="font-semibold text-lg pt-4">Languages</h3>
      {(formData.languages || []).map((lang, index) => (
        <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg w-full">
          <input
            type="text"
            value={lang.code || ''}
            onChange={(e) => updateFormData(`languages.${index}.code`, e.target.value)}
            placeholder="Code (us, bd)"
            className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={lang.name || ''}
            onChange={(e) => updateFormData(`languages.${index}.name`, e.target.value)}
            placeholder="Language Name"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Flag URL field with drag and drop support */}
          <div className="flex-1 relative">
            <div
              className={`relative border-2 border-dashed rounded-lg p-2 transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="flex items-center gap-2">
                {lang.flag ? (
                  <div className="flex items-center gap-2 w-full">
                    <img
                      src={lang.flag}
                      alt={lang.name || 'Flag'}
                      className="w-8 h-6 object-cover rounded"
                    />
                    <span className="text-xs text-gray-500 truncate flex-1">
                      {typeof lang.flag === 'string' && lang.flag.startsWith('data:image')
                        ? 'New image (will be uploaded)'
                        : lang.flag.substring(0, 30) + '...'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFlag(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                      title="Remove flag"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full text-gray-400">
                    <FaUpload size={16} />
                    <span className="text-sm">Drop flag image or click to browse</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, index)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading || isUploading}
                />
              </div>
              {uploading[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeArrayItem('languages', index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
            disabled={isLoading || isUploading}
          >
            <FaTrash size={14} />
          </button>
        </div>
      ))}

      {/* Add Language */}
      <button
        type="button"
        onClick={() => addArrayItem('languages', { code: '', name: '', flag: '' })}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        disabled={isLoading || isUploading}
      >
        <FaPlus size={14} /> Add Language
      </button>

      {/* Social Links Section - Can ONLY edit, NO add/remove */}
      <h3 className="font-semibold text-lg pt-4">Social Links</h3>

      {/* Social Links */}
      <p className="text-xs text-gray-500 mb-2">Edit social links (leave URL empty to hide)</p>
      {(formData.socialLinks || []).map((link, index) => (
        <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg w-full">
          {/* Icon Name - Unchangeable / Read-only */}
          <input
            type="text"
            value={link.iconName || ''}
            className="w-40 px-3 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            disabled={true}
            readOnly
          />
          <input
            type="text"
            value={link.url || ''}
            onChange={(e) => updateFormData(`socialLinks.${index}.url`, e.target.value)}
            placeholder="URL (leave empty to hide)"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || isUploading}
          />
          <input
            type="text"
            value={link.name || ''}
            onChange={(e) => updateFormData(`socialLinks.${index}.name`, e.target.value)}
            placeholder="Name"
            className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || isUploading}
          />
          <div className="w-10"></div>
        </div>
      ))}
    </div>
  );
}