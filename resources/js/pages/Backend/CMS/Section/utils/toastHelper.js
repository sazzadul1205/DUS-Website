// resources/js/pages/Backend/CMS/Section/utils/toastHelper.js

import Swal from 'sweetalert2';

/**
 * Toast Helper - Simple reliable toast
 */
export const showToast = (icon, title, text = '', timer = 3000) => {
  // ✅ Simple approach - most reliable
  const toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    icon,
    title,
    text,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });

  // Store the toast instance
  const toastInstance = toast.fire();

  // Add click-to-close after toast is rendered
  setTimeout(() => {
    const popup = document.querySelector('.swal2-popup');
    if (popup) {
      popup.style.cursor = 'pointer';
      popup.addEventListener('click', () => {
        Swal.close();
      });
    }
  }, 100);

  return toastInstance;
};

// Convenience methods
export const showSuccessToast = (title, text = '', timer = 3000) => {
  showToast('success', title, text, timer);
};

export const showErrorToast = (title, text = '', timer = 4000) => {
  showToast('error', title, text, timer);
};

export const showWarningToast = (title, text = '', timer = 3000) => {
  showToast('warning', title, text, timer);
};

export const showInfoToast = (title, text = '', timer = 3000) => {
  showToast('info', title, text, timer);
};

export const showConfirmDialog = (options = {}) => {
  const defaultOptions = {
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      title: 'text-lg font-semibold',
      htmlContainer: 'text-sm',
      confirmButton: 'px-5 py-2.5 rounded-xl font-medium transition hover:scale-[1.02]',
      cancelButton: 'px-5 py-2.5 rounded-xl font-medium transition hover:bg-gray-100',
    },
    showLoaderOnConfirm: true,
  };

  return Swal.fire({
    ...defaultOptions,
    ...options,
  });
};