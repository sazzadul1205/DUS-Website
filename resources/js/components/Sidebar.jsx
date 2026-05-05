// resources/js/Components/Sidebar.jsx

// React
import { useState, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';

// Icons
import {
  FiHome,
  FiBell,
  FiBriefcase,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiUser,
  FiSearch,
  FiPlusCircle,
  FiUsers,
  FiBarChart2,
  FiDownload,
  FiMail,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiGrid,
  FiList,
  FiPieChart,
  FiActivity,
  FiBookmark,
  FiTarget,
  FiAward,
} from 'react-icons/fi';
import {
  MdCategory,
  MdWorkOutline,
  MdDashboard,
  MdPersonOutline,
  MdBusinessCenter,
} from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

const Sidebar = () => {
  const { url, props } = usePage();
  const { auth } = props;
  const notificationMeta = props.notifications || { unread_count: 0, recent: [] };

  // Get user role
  const user = auth?.user;
  const userName = user?.name || 'User';
  const userRole = user?.role || 'job_seeker';
  const userEmail = user?.email || '';

  // State to track open menus
  const [openMenus, setOpenMenus] = useState({
    jobs: false,
    applications: false,
    employerJobs: false,
    employerApps: false,
  });

  // State for collapsed sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-expand menus based on current URL
  useEffect(() => {
    const newOpenMenus = { ...openMenus };

    // Jobs management section
    if (url.includes('/listing') || url.includes('/locations') || url.includes('/categories')) {
      newOpenMenus.jobs = true;
      newOpenMenus.employerJobs = true;
    }

    // Applications section
    if (url.includes('/applications') || url.includes('/apply')) {
      newOpenMenus.applications = true;
      newOpenMenus.employerApps = true;
    }

    setOpenMenus(newOpenMenus);
  }, [url]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const route = (name, params = {}) => {
    if (typeof window !== 'undefined' && window.route) {
      try {
        return window.route(name, params);
      } catch (e) {
        return '#';
      }
    }
    return '#';
  };

  // Helper function to normalize URL
  const normalizeUrl = (value) => {
    if (!value) return '';
    const absolute = typeof value === 'string' ? value : value.toString();
    const pathOnly = absolute.replace(/^https?:\/\/[^/]+/i, '');
    return pathOnly.replace(/\/$/, '');
  };

  // Check if route is active
  const isRouteActive = (routeName, params = {}, aliasPaths = [], options = {}) => {
    try {
      const routeUrl = route(routeName, params);
      if (routeUrl === '#') return false;

      const normalizedUrl = normalizeUrl(url);
      const normalizedRouteUrl = normalizeUrl(routeUrl);
      const normalizedAliases = (aliasPaths || [])
        .filter(Boolean)
        .map((path) => normalizeUrl(path));
      const normalizedExcludes = (options?.excludePaths || [])
        .filter(Boolean)
        .map((path) => normalizeUrl(path));

      if (normalizedUrl === normalizedRouteUrl) return true;

      if (normalizedAliases.some((alias) => normalizedUrl === alias || normalizedUrl.startsWith(alias))) {
        return true;
      }

      if (normalizedExcludes.some((exclude) => normalizedUrl === exclude || normalizedUrl.startsWith(exclude))) {
        return false;
      }

      if (options?.exact) return false;

      if (normalizedRouteUrl !== '/' && normalizedUrl.startsWith(normalizedRouteUrl)) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  };

  // Check if path is active
  const isPathActive = (path) => {
    if (!path || path === '#') return false;

    const normalizedUrl = normalizeUrl(url);
    const normalizedPath = normalizeUrl(path);

    if (normalizedUrl === normalizedPath) return true;
    if (normalizedPath !== '/' && normalizedUrl.startsWith(normalizedPath)) return true;

    return false;
  };

  // Check if any subitem in a dropdown is active
  const isDropdownActive = (subItems) => {
    return subItems?.some(subItem => {
      if (subItem.href && subItem.href !== '#') {
        return isPathActive(subItem.href);
      }
      if (subItem.routeName) {
        return isRouteActive(subItem.routeName, subItem.routeParams || {}, subItem.activeAliases || [], { exact: subItem.exact, excludePaths: subItem.activeExclude });
      }
      return false;
    });
  };

  // Job Seeker Menu Items
  const jobSeekerItems = useMemo(() => [
    {
      name: 'Dashboard',
      routeName: 'dashboard',
      icon: FiHome,
      description: 'Overview & stats',
    },
    {
      name: 'Browse Jobs',
      routeName: 'backend.public-jobs.index',
      icon: FiSearch,
      description: 'Find your next role',
    },
    {
      name: 'My Profile',
      routeName: 'backend.applicant.profile.show',
      routeParams: { id: user?.id },
      activeAliases: user?.id ? [`/backend/applicant/profile/${user.id}`] : [],
      icon: FiUser,
      description: 'View & edit profile',
    },
    {
      name: 'My Applications',
      routeName: 'backend.apply.index',
      icon: FiFileText,
      description: 'Track applications',
    },
    {
      name: 'Notifications',
      routeName: 'backend.notifications.index',
      icon: FiBell,
      badgeCount: notificationMeta.unread_count,
      description: 'Updates & alerts',
    },
  ], [user?.id, notificationMeta.unread_count]);

  // Employer Menu Items - IMPROVED with dropdowns
  const employerItems = useMemo(() => [
    {
      name: 'Dashboard',
      routeName: 'dashboard',
      icon: FiHome,
      description: 'Overview & analytics',
    },
    {
      name: 'Job Listings',
      icon: FiBriefcase,
      isDropdown: true,
      dropdownKey: 'employerJobs',
      description: 'Manage job posts',
      subItems: [
        {
          name: 'All Jobs',
          routeName: 'backend.listing.index',
          activeExclude: ['/backend/listing/create'],
          icon: FiList,
          description: 'View all listings',
        },
        {
          name: 'Create New Job',
          routeName: 'backend.listing.create',
          icon: FiPlusCircle,
          description: 'Post a new job',
        },
        {
          name: 'Active Jobs',
          routeName: 'backend.listing.index',
          routeParams: { status: 'active' },
          icon: FiCheckCircle,
        },
        {
          name: 'Inactive Jobs',
          routeName: 'backend.listing.index',
          routeParams: { status: 'inactive' },
          icon: FiClock,
        },
      ],
    },
    {
      name: 'Applications',
      icon: FiFileText,
      isDropdown: true,
      dropdownKey: 'employerApps',
      description: 'Review candidates',
      subItems: [
        {
          name: 'All Applications',
          routeName: 'backend.applications.index',
          icon: FiUsers,
          description: 'View all candidates',
        },
        {
          name: 'Pending',
          routeName: 'backend.applications.index',
          routeParams: { status: 'pending' },
          icon: FiClock,
          badgeColor: 'bg-yellow-500',
        },
        {
          name: 'Shortlisted',
          routeName: 'backend.applications.index',
          routeParams: { status: 'shortlisted' },
          icon: FiStar,
          badgeColor: 'bg-green-500',
        },
        {
          name: 'Rejected',
          routeName: 'backend.applications.index',
          routeParams: { status: 'rejected' },
          icon: FiXCircle,
          badgeColor: 'bg-red-500',
        },
        {
          name: 'Hired',
          routeName: 'backend.applications.index',
          routeParams: { status: 'hired' },
          icon: FiAward,
          badgeColor: 'bg-purple-500',
        },
      ],
    },
    {
      name: 'Company Profile',
      routeName: 'backend.employer.profile.edit',
      icon: HiOutlineBuildingOffice2,
      description: 'Company settings',
    },
    {
      name: 'Notifications',
      routeName: 'backend.notifications.index',
      icon: FiBell,
      badgeCount: notificationMeta.unread_count,
      description: 'Updates & alerts',
    },
  ], [notificationMeta.unread_count]);

  // Admin Menu Items
  const adminItems = useMemo(() => [
    {
      name: 'Dashboard',
      routeName: 'dashboard',
      icon: FiHome,
      description: 'System overview',
    },
    {
      name: 'Jobs Management',
      icon: FiBriefcase,
      isDropdown: true,
      dropdownKey: 'jobs',
      description: 'Manage all jobs',
      subItems: [
        {
          name: 'All Jobs',
          routeName: 'backend.listing.index',
          activeExclude: ['/backend/listing/create'],
          icon: FiList,
        },
        {
          name: 'Create New Job',
          routeName: 'backend.listing.create',
          icon: FiPlusCircle,
          highlight: true,
        },
        {
          name: 'Locations',
          routeName: 'backend.locations.index',
          icon: FaSearchLocation,
        },
        {
          name: 'Categories',
          routeName: 'backend.categories.index',
          icon: MdCategory,
        },
        {
          name: 'Job Statistics',
          routeName: 'backend.listing.index',
          routeParams: { view: 'stats' },
          icon: FiBarChart2,
        },
      ],
    },
    {
      name: 'Applications',
      icon: FiFileText,
      isDropdown: true,
      dropdownKey: 'applications',
      description: 'All applications',
      subItems: [
        {
          name: 'All Applications',
          routeName: 'backend.applications.index',
          icon: FiUsers,
        },
        {
          name: 'Pending',
          routeName: 'backend.applications.index',
          routeParams: { status: 'pending' },
          icon: FiClock,
          badgeColor: 'bg-yellow-500',
        },
        {
          name: 'Shortlisted',
          routeName: 'backend.applications.index',
          routeParams: { status: 'shortlisted' },
          icon: FiStar,
          badgeColor: 'bg-green-500',
        },
        {
          name: 'Rejected',
          routeName: 'backend.applications.index',
          routeParams: { status: 'rejected' },
          icon: FiXCircle,
          badgeColor: 'bg-red-500',
        },
        {
          name: 'Hired',
          routeName: 'backend.applications.index',
          routeParams: { status: 'hired' },
          icon: FiAward,
          badgeColor: 'bg-purple-500',
        },
      ],
    },
    {
      name: 'Users Management',
      routeName: 'admin.users.index',
      icon: FiUsers,
      description: 'Manage users',
    },
    {
      name: 'Notifications',
      routeName: 'backend.notifications.index',
      icon: FiBell,
      badgeCount: notificationMeta.unread_count,
      description: 'System alerts',
    },
    {
      name: 'Settings',
      routeName: 'admin.settings',
      icon: FiSettings,
      description: 'System configuration',
    },
  ], [notificationMeta.unread_count]);

  // Get menu items based on user role
  const menuItems = useMemo(() => {
    if (userRole === 'job_seeker') return jobSeekerItems;
    if (userRole === 'employer') return employerItems;
    if (userRole === 'admin') return adminItems;
    return [];
  }, [userRole, jobSeekerItems, employerItems, adminItems]);

  // Get role-based color scheme
  const roleColors = {
    admin: {
      light: 'from-red-600 to-red-700',
      dark: 'dark:from-red-500 dark:to-red-600',
      bg: 'bg-red-500',
      text: 'text-red-600',
      border: 'border-red-500',
      hover: 'hover:bg-red-50',
      active: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    employer: {
      light: 'from-blue-600 to-blue-700',
      dark: 'dark:from-blue-500 dark:to-blue-600',
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      border: 'border-blue-500',
      hover: 'hover:bg-blue-50',
      active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    job_seeker: {
      light: 'from-green-600 to-green-700',
      dark: 'dark:from-green-500 dark:to-green-600',
      bg: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-500',
      hover: 'hover:bg-green-50',
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
  };

  const colors = roleColors[userRole] || roleColors.job_seeker;

  // Render sub menu item
  const renderSubMenuItem = (subItem) => {
    const isActiveSub = subItem.routeName
      ? isRouteActive(subItem.routeName, subItem.routeParams || {}, subItem.activeAliases || [], { exact: subItem.exact, excludePaths: subItem.activeExclude })
      : isPathActive(subItem.href);

    return (
      <Link
        key={subItem.name}
        href={subItem.routeName ? route(subItem.routeName, subItem.routeParams || {}) : subItem.href}
        className={`
          flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200 group relative
          ${isActiveSub
            ? `${colors.active} font-medium border-l-3 ${colors.border}`
            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
          }
        `}
      >
        {subItem.icon && (
          <subItem.icon className={`w-4 h-4 ${isActiveSub ? colors.text : 'text-gray-400 group-hover:text-gray-600'}`} />
        )}
        <span className="flex-1">{subItem.name}</span>
        {subItem.badgeColor && (
          <span className={`w-2 h-2 rounded-full ${subItem.badgeColor}`}></span>
        )}
        {isActiveSub && (
          <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`}></span>
        )}
      </Link>
    );
  };

  // Render menu item
  const renderMenuItem = (item) => {
    if (item.isDropdown) {
      const isOpen = openMenus[item.dropdownKey];
      const isDropdownItemActive = isDropdownActive(item.subItems);

      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleMenu(item.dropdownKey)}
            className={`
              w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all duration-200 group
              ${isDropdownItemActive
                ? colors.active + ' font-semibold'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }
            `}
            title={item.description}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${isDropdownItemActive ? colors.text : 'text-gray-400 group-hover:text-gray-600'}`} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </div>
            {!isCollapsed && (
              isOpen ? (
                <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownItemActive ? colors.text : ''}`} />
              ) : (
                <FiChevronRight className={`w-4 h-4 transition-transform duration-200 ${isDropdownItemActive ? colors.text : ''}`} />
              )
            )}
          </button>

          {isOpen && !isCollapsed && (
            <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
              {item.subItems.map((subItem) => renderSubMenuItem(subItem))}
            </div>
          )}
        </div>
      );
    }

    // For non-dropdown items
    const isMenuItemActive = item.routeName
      ? isRouteActive(item.routeName, item.routeParams || {}, item.activeAliases || [], { exact: item.exact, excludePaths: item.activeExclude })
      : isPathActive(item.href);

    return (
      <Link
        key={item.name}
        href={item.routeName ? route(item.routeName, item.routeParams || {}) : item.href}
        className={`
          flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 mb-1 relative group
          ${isMenuItemActive
            ? colors.active + ' font-semibold shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }
        `}
        title={item.description}
      >
        <item.icon className={`w-5 h-5 ${isMenuItemActive ? colors.text : 'text-gray-400 group-hover:text-gray-600'}`} />
        {!isCollapsed && <span className="flex-1">{item.name}</span>}
        {!isCollapsed && item.badgeCount > 0 && (
          <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
            {item.badgeCount > 99 ? '99+' : item.badgeCount}
          </span>
        )}
        {isMenuItemActive && !isCollapsed && (
          <span className={`absolute left-0 w-1 h-8 ${colors.bg} rounded-r-full`}></span>
        )}
        {isMenuItemActive && isCollapsed && (
          <span className={`absolute right-0 w-1.5 h-1.5 rounded-full ${colors.bg}`}></span>
        )}
      </Link>
    );
  };

  return (
    <aside className={`fixed left-0 top-0 h-full ${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl transition-all duration-300 z-50`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <Link href={route('home')} className="flex items-center gap-2 group">
            <div className={`w-8 h-8 bg-linear-to-br ${colors.light} ${colors.dark} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200`}>
              <FiBriefcase className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                JobMatch
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <FiChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {/* Section Label */}
        {!isCollapsed && (
          <div className="px-4 mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {userRole === 'admin' ? 'Administration' : userRole === 'employer' ? 'Employer Portal' : 'Job Seeker'}
            </p>
          </div>
        )}

        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>

      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full bg-linear-to-br ${colors.light} ${colors.dark} flex items-center justify-center shadow-md`}>
                <span className="text-white font-semibold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 capitalize flex items-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`}></span>
                  {userRole === 'admin' ? 'Administrator' : userRole === 'employer' ? 'Employer' : 'Job Seeker'}
                </p>
              </div>
            </div>

            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
            >
              <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Logout</span>
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-linear-to-br ${colors.light} ${colors.dark} flex items-center justify-center shadow-md`}>
              <span className="text-white font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
