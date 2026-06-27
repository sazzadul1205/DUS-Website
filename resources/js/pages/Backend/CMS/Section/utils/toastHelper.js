// resources/js/pages/Backend/CMS/Section/utils/toastHelper.js

import Swal from 'sweetalert2';

// Toast notification helper
export const showToast = (icon, title, text = '', timer = 3000) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: '!rounded-xl !shadow-2xl',
      title: '!text-sm !font-semibold',
      htmlContainer: '!text-xs !text-gray-600',
    }
  });

  Toast.fire({
    icon,
    title,
    text,
  });
};