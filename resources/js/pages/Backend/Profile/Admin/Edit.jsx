// resources/js/Pages/Backend/Profile/Admin/Edit.jsx

import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';

// Icons
import {
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserShield,
  FaKey,
  FaTrash,
} from 'react-icons/fa';

export default function Edit({ user }) {
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const { data: profileData, setData: setProfileData, patch, processing: profileProcessing, errors: profileErrors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Password form
  const { data: passwordData, setData: setPasswordData, put, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    patch(route('backend.admin-profile.update'), {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully!',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      onError: (errors) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: Object.values(errors).flat().join('\n'),
        });
      }
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    put(route('backend.admin-profile.password.update'), {
      onSuccess: () => {
        resetPassword();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password updated successfully!',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      onError: (errors) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: Object.values(errors).flat().join('\n'),
        });
      }
    });
  };

  const handleCancel = () => {
    router.visit(route('backend.admin-profile.show'));
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <AuthenticatedLayout>
      <Head title="Edit Admin Profile" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors group"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Profile</span>
            </button>

            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Edit Admin Profile
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Update your account information and password
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex gap-1 px-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`inline-flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <FaUser size={16} />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`inline-flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === 'password'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <FaLock size={16} />
                  Change Password
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="p-6 md:p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Information</h2>
                    <p className="text-sm text-gray-500">Update your account details</p>
                  </div>

                  <div className="space-y-5">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData('name', e.target.value)}
                          required
                          autoComplete="name"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${profileErrors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Your full name"
                        />
                      </div>
                      {profileErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData('email', e.target.value)}
                          required
                          autoComplete="email"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${profileErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {profileErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <FaCheckCircle className="text-blue-500 mt-0.5" size={18} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Profile Information Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Use your real name for official communications</li>
                        <li>Keep your email address up to date for important notifications</li>
                        <li>Your email will be used for system-wide communications</li>
                      </ul>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                    >
                      <FaTimes size={14} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={profileProcessing}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {profileProcessing ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />}
                      {profileProcessing ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="p-6 md:p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Change Password</h2>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>

                  <div className="space-y-5">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData('current_password', e.target.value)}
                          required
                          autoComplete="current-password"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.current_password ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Enter current password"
                        />
                      </div>
                      {passwordErrors.current_password && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.password}
                          onChange={(e) => setPasswordData('password', e.target.value)}
                          required
                          autoComplete="new-password"
                          className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Enter new password (min 8 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaLock size={16} /> : <FaKey size={16} />}
                        </button>
                      </div>
                      {passwordErrors.password && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>
                      )}

                      {/* Password Strength Indicator */}
                      {passwordData.password && (
                        <div className="mt-2">
                          <div className="flex gap-1 h-1.5 mb-2">
                            {[0, 1, 2, 3, 4].map((index) => (
                              <div
                                key={index}
                                className={`flex-1 rounded-full transition-all ${index < passwordStrength
                                  ? strengthColors[passwordStrength - 1]
                                  : 'bg-gray-200'
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600">
                            Password Strength: <span className="font-medium">{strengthLabels[passwordStrength - 1] || 'Very Weak'}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.password_confirmation}
                          onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                          required
                          autoComplete="new-password"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${passwordErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Confirm new password"
                        />
                      </div>
                      {passwordErrors.password_confirmation && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.password_confirmation}</p>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Password Requirements:</p>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li className="flex items-center gap-2">
                          {passwordData.password.length >= 8 ?
                            <FaCheckCircle className="text-green-600" size={12} /> :
                            <FaExclamationCircle className="text-blue-600" size={12} />
                          }
                          Minimum 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                          {/[A-Z]/.test(passwordData.password) ?
                            <FaCheckCircle className="text-green-600" size={12} /> :
                            <FaExclamationCircle className="text-blue-600" size={12} />
                          }
                          At least one uppercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          {/[a-z]/.test(passwordData.password) ?
                            <FaCheckCircle className="text-green-600" size={12} /> :
                            <FaExclamationCircle className="text-blue-600" size={12} />
                          }
                          At least one lowercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          {/[0-9]/.test(passwordData.password) ?
                            <FaCheckCircle className="text-green-600" size={12} /> :
                            <FaExclamationCircle className="text-blue-600" size={12} />
                          }
                          At least one number
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                    >
                      <FaTimes size={14} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={passwordProcessing}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {passwordProcessing ? <FaSpinner className="animate-spin" size={14} /> : <FaLock size={14} />}
                      {passwordProcessing ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}