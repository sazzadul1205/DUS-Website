// resources/js/Pages/Backend/Profile/Admin/Show.jsx

import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';

// Icons
import {
  FaEdit,
  FaEnvelope,
  FaCalendarAlt,
  FaUserShield,
  FaCheckCircle,
  FaLock,
  FaArrowLeft,
  FaUser,
  FaShieldAlt,
  FaKey,
  FaClock,
} from 'react-icons/fa';

export default function Show({ user }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Admin Profile - ${user.name}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors group"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back</span>
            </button>

            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Profile
                </h1>
                <p className="text-sm text-gray-500 mt-1">{user.name}</p>
              </div>

              <Link
                href={route('backend.admin-profile.edit')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200"
              >
                <FaEdit size={14} />
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <FaUserShield className="text-blue-500" size={22} />
                  Profile Information
                </h2>

                <div className="flex items-start gap-6 mb-6">
                  <div className="shrink-0">
                    <div className="w-24 h-24 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                      <FaUser className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <FaShieldAlt size={12} />
                      {user.primary_role || 'Administrator'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <FaEnvelope className="text-blue-500" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <a href={`mailto:${user.email}`} className="text-sm text-blue-600 hover:underline">
                        {user.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <FaCalendarAlt className="text-green-500" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity & Permissions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <FaShieldAlt className="text-purple-500" size={22} />
                  Permissions & Access
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="text-purple-500" size={16} />
                      <span className="text-sm font-semibold text-purple-700">Full System Access</span>
                    </div>
                    <p className="text-xs text-purple-600">
                      As an administrator, you have full access to all system features including user management,
                      job management, application reviews, and system settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500" size={12} />
                      User Management
                    </div>
                    <div className="flex items-center gap-2 p-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500" size={12} />
                      Job Management
                    </div>
                    <div className="flex items-center gap-2 p-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500" size={12} />
                      Application Review
                    </div>
                    <div className="flex items-center gap-2 p-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500" size={12} />
                      System Settings
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <FaLock className="text-gray-500" size={18} />
                  Account Status
                </h2>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="text-green-500" size={16} />
                      <span className="text-sm font-semibold text-green-700">Active</span>
                    </div>
                    <p className="text-xs text-green-600">
                      Account is active and in good standing.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Role</span>
                      <span className="font-medium text-gray-900">{user.primary_role || 'Administrator'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Account ID</span>
                      <span className="font-medium text-gray-900">#{user.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Login</span>
                      <span className="font-medium text-gray-900">{formatDate(user.last_login_at) || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <Link
                      href={route('backend.admin-profile.edit')}
                      className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <FaEdit size={14} />
                      Edit Profile
                    </Link>
                    <Link
                      href={route('backend.admin-profile.edit', { tab: 'password' })}
                      className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition flex items-center justify-center gap-2"
                    >
                      <FaKey size={14} />
                      Change Password
                    </Link>
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaLock className="text-red-500" size={18} />
                  Security Tips
                </h2>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-0.5" size={12} />
                    Use a strong, unique password
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-0.5" size={12} />
                    Enable two-factor authentication
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-0.5" size={12} />
                    Never share your login credentials
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-0.5" size={12} />
                    Log out when using public computers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}