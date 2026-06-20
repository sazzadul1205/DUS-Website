// resources/js/layouts/AuthenticatedLayout.jsx

import { usePage } from '@inertiajs/react';
import JobSeekerLayout from './JobSeekerLayout';
import AdminLayout from './AdminLayout';

const AuthenticatedLayout = ({ children }) => {
  const { props } = usePage();
  const { auth } = props;
  const user = auth?.user;
  const userRoles = user?.roles || [];

  // Check if user is a job seeker only (no admin/employer roles)
  const isJobSeekerOnly = () => {
    const hasAdminRole = userRoles.some(role =>
      ['super-admin', 'admin', 'employer-admin', 'hr-manager', 'recruiter'].includes(role.slug)
    );
    return !hasAdminRole;
  };

  // Render appropriate layout based on user role
  if (isJobSeekerOnly()) {
    return <JobSeekerLayout>{children}</JobSeekerLayout>;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default AuthenticatedLayout;