// resources/js/Pages/Backend/ApplicantProfile/Modals/BasicInfoModal.jsx

// React
import { useState, useRef, useEffect } from 'react';

// Icons
import {
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaIdCard,
  FaBirthdayCake,
  FaGlobe,
  FaVenusMars,
  FaTrash,
  FaCloudUploadAlt,
  FaImage,
} from 'react-icons/fa';
import { MdOutlineBloodtype } from 'react-icons/md';

// SweetAlert
import Swal from 'sweetalert2';

// Components
import Modal from './Modal';

/**
 * BasicInfoModal Component
 * 
 * Allows users to edit their personal information including:
 * - Name (first and last)
 * - Profile photo (upload, preview, delete)
 * - Phone number
 * - Birth date
 * - Gender
 * - Blood type
 * - Address
 * 
 * Features:
 * - Drag-and-drop photo upload
 * - Image preview before upload
 * - Photo deletion
 * - Form validation for required fields
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback when modal closes
 * @param {Object} props.profile - User profile data
 */
const BasicInfoModal = ({ isOpen, onClose, profile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  /**
   * Normalize date string to YYYY-MM-DD format for date input
   * @param {string|Date} value - Date value to normalize
   * @returns {string} - Formatted date string
   */
  const normalizeDate = (value) => {
    if (!value) return '';
    if (typeof value === 'string') {
      if (value.length >= 10) return value.slice(0, 10);
      return value;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toISOString().slice(0, 10);
  };

  const [modalData, setModalData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    birth_date: normalizeDate(profile?.birth_date),
    gender: profile?.gender || '',
    blood_type: profile?.blood_type || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    photo: null,
    photoPreview: null,
    remove_photo: false,
  });

  /**
   * Handle drag events for photo upload area
   * @param {DragEvent} e - Drag event
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Handle dropped file for photo upload
   * @param {DragEvent} e - Drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetPhoto(file);
    }
  };

  /**
   * Handle file input change for photo upload
   * @param {Event} e - Change event
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetPhoto(file);
    }
    e.target.value = ''; // Allow re-selecting the same file next time
  };

  /**
   * Validate uploaded photo and set it to state
   * @param {File} file - Uploaded file
   */
  const validateAndSetPhoto = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please upload a valid image file (JPG, PNG, or GIF)',
      });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 2MB',
      });
      return;
    }
    // Revoke previous preview URL to avoid memory leaks
    if (modalData.photoPreview) {
      URL.revokeObjectURL(modalData.photoPreview);
    }
    const newPreviewUrl = URL.createObjectURL(file);
    setModalData({ ...modalData, photo: file, photoPreview: newPreviewUrl, remove_photo: false });
  };

  /**
   * Delete current profile photo
   */
  const handleDeletePhoto = () => {
    if (modalData.photoPreview) {
      URL.revokeObjectURL(modalData.photoPreview);
    }
    setModalData({ ...modalData, photo: null, photoPreview: null, remove_photo: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  /**
   * Save basic information to server
   * Sends PATCH request with FormData (supports file upload)
   */
  const handleSave = async () => {
    setSaving(true);

    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('first_name', modalData.first_name);
    formData.append('last_name', modalData.last_name);
    if (modalData.birth_date) formData.append('birth_date', modalData.birth_date);
    if (modalData.gender) formData.append('gender', modalData.gender);
    if (modalData.blood_type) formData.append('blood_type', modalData.blood_type);
    if (modalData.phone) formData.append('phone', modalData.phone);
    if (modalData.address) formData.append('address', modalData.address);
    if (modalData.remove_photo) formData.append('remove_photo', '1');
    if (modalData.photo) formData.append('photo', modalData.photo);

    try {
      const response = await fetch(route('backend.applicant.profile.update-basic-info', profile.id), {
        method: 'POST', // Using POST with _method=PATCH for file upload support
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Clean up preview URL after successful save
        if (modalData.photoPreview) {
          URL.revokeObjectURL(modalData.photoPreview);
        }

        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Basic information updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });

        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to update');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update basic information.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset modal data when opened
  useEffect(() => {
    if (!isOpen) return;

    if (modalData.photoPreview) {
      URL.revokeObjectURL(modalData.photoPreview);
    }

    setModalData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      birth_date: normalizeDate(profile?.birth_date),
      gender: profile?.gender || '',
      blood_type: profile?.blood_type || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      photo: null,
      photoPreview: null,
      remove_photo: false,
    });
  }, [isOpen, profile?.id]);

  if (!isOpen) return null;

  return (
    <Modal title="Edit Basic Information" onClose={onClose} onSave={handleSave} saving={saving}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Photo */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Profile Photo
              </label>

              {/* Photo Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${dragActive
                  ? 'border-blue-500 bg-blue-50 scale-105'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={handleFileChange}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Upload profile photo"
                />

                {/* Photo Preview or Placeholder */}
                {modalData.photoPreview || profile?.photo_url ? (
                  <img
                    src={modalData.photoPreview || profile?.photo_url}
                    alt={profile?.full_name || 'Profile'}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      setModalData({ ...modalData, photoPreview: null });
                    }}
                  />
                ) : (
                  <div className="w-full h-64 flex flex-col items-center justify-center text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-blue-100 rounded-full">
                        <FaCloudUploadAlt className="h-10 w-10 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">Drop your photo here</p>
                    <p className="text-gray-400 text-sm mb-3">or click to browse</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                      <FaImage className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">JPG, PNG, GIF up to 2MB</span>
                    </div>
                  </div>
                )}

                {/* Photo Action Overlay (Change/Delete) */}
                {(modalData.photoPreview || profile?.photo_url) && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-end justify-center pb-6 gap-3 rounded-2xl">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-5 py-2.5 bg-white text-gray-800 rounded-xl hover:bg-gray-100 font-medium text-sm flex items-center gap-2 shadow-lg"
                    >
                      <FaImage className="h-4 w-4" /> Change
                    </button>
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium text-sm flex items-center gap-2 shadow-lg"
                    >
                      <FaTrash size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaIdCard className="h-4 w-4 text-blue-500" />
                    First Name
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={modalData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={modalData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Phone & Birth Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaPhone className="h-4 w-4 text-blue-500" />
                    Phone Number
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={modalData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="+880 1XXX XXXXXX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaBirthdayCake className="h-4 w-4 text-blue-500" />
                    Birth Date
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="birth_date"
                    value={modalData.birth_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Gender & Blood Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaVenusMars className="h-4 w-4 text-blue-500" />
                    Gender
                  </span>
                </label>
                <select
                  name="gender"
                  value={modalData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="">Select gender</option>
                  {genders.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <MdOutlineBloodtype className="h-4 w-4 text-red-500" />
                    Blood Type
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHeartbeat className="h-5 w-5 text-red-400" />
                  </div>
                  <select
                    name="blood_type"
                    value={modalData.blood_type}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Select blood type</option>
                    {bloodTypes.map(bt => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4 text-blue-500" />
                  Address
                </span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-3 pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="address"
                  value={modalData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Your full address"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-full">
                <FaGlobe className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Note:</span> First name, last name, and phone are required fields.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BasicInfoModal;