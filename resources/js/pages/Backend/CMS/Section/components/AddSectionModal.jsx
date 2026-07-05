/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/components/AddSectionModal.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
  FaTimes,
  FaPlus,
  FaSpinner,
  FaSearch,
  FaTag,
  FaDatabase,
  FaCode,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaLayerGroup,
  FaFileAlt,
  FaImages,
  FaVideo,
  FaBriefcase,
  FaNewspaper,
  FaQuestionCircle,
  FaCalendarAlt,
  FaHome,
  FaInfo,
  FaHands,
  FaMapMarkedAlt,
  FaUserFriends,
  FaAddressCard,
  FaPhoneAlt,
  FaGavel,
  FaChartBar
} from 'react-icons/fa';
import { showToast } from '../utils/toastHelper';

// Icon mapping for section types
const SECTION_ICONS = {
  'BlogSection': FaNewspaper,
  'OurProgramsSection': FaLayerGroup,
  'FAQSection': FaQuestionCircle,
  'UpcomingEventsSection': FaCalendarAlt,
  'ContentSection': FaFileAlt,
  'PublicationsSection': FaNewspaper,
  'StoriesSection': FaUserFriends,
  'HomeBanner': FaHome,
  'PageBannerSection': FaInfo,
  'PageTagBannerSection': FaTag,
  'AboutUsSection': FaInfo,
  'OurActionSection': FaHands,
  'WhereWeWorkSection': FaMapMarkedAlt,
  'HeroFigureSection': FaUserFriends,
  'CardsSection': FaLayerGroup,
  'ContactOfficeSection': FaAddressCard,
  'AddressSection': FaMapMarkedAlt,
  'ContactReachSection': FaPhoneAlt,
  'JobsSection': FaBriefcase,
  'FollowUSSection': FaUserFriends,
  'LegalSection': FaGavel,
  'ProgramImpactSection': FaChartBar,
  'ImageGallerySection': FaImages,
  'VideoGallerySection': FaVideo,
};

const SECTION_OPTIONS = {
  // ============================================
  // SPECIAL SECTIONS (use external data tables)
  // ============================================
  'BlogSection': {
    label: 'Blog Section',
    data_table: 'blogs',
    description: 'Display blog posts from the Blog Manager',
    isSpecial: true,
    category: 'content',
    badge: 'Dynamic'
  },
  'OurProgramsSection': {
    label: 'Programs Section',
    data_table: 'programs',
    description: 'Display programs from the Program Manager',
    isSpecial: true,
    category: 'content',
    badge: 'Dynamic'
  },
  'FAQSection': {
    label: 'FAQ Section',
    data_table: 'shared_data',
    description: 'Display frequently asked questions (Shared Data)',
    isSpecial: true,
    category: 'content',
    badge: 'Shared'
  },
  'UpcomingEventsSection': {
    label: 'Upcoming Events Section',
    data_table: 'shared_data',
    description: 'Display upcoming events and activities (Shared Data)',
    isSpecial: true,
    category: 'content',
    badge: 'Shared'
  },
  'ContentSection': {
    label: 'Dynamic Content Section',
    data_table: 'about_content',
    description: 'Display dynamic content from About Content Manager',
    isSpecial: true,
    category: 'content',
    badge: 'Dynamic'
  },
  'PublicationsSection': {
    label: 'Publications Section',
    data_table: 'publications',
    description: 'Display publications from Publications Manager',
    isSpecial: true,
    category: 'content',
    badge: 'Dynamic'
  },
  'StoriesSection': {
    label: 'Stories Section',
    data_table: 'shared_data',
    description: 'Display stories with images and descriptions (Shared Data)',
    isSpecial: true,
    category: 'content',
    badge: 'Shared'
  },

  // ============================================
  // CUSTOM DATA SECTIONS (create custom_section_data entries)
  // ============================================
  'HomeBanner': {
    label: 'Home Banner',
    data_table: 'custom_section_data',
    description: 'Full-width hero banner with text, buttons, and background image',
    isSpecial: false,
    category: 'banner',
    badge: 'Custom'
  },
  'PageBannerSection': {
    label: 'Page Banner',
    data_table: 'custom_section_data',
    description: 'Page header banner with title and description',
    isSpecial: false,
    category: 'banner',
    badge: 'Custom'
  },
  'PageTagBannerSection': {
    label: 'Tag Banner',
    data_table: 'custom_section_data',
    description: 'Page header banner with tag filters and title',
    isSpecial: false,
    category: 'banner',
    badge: 'Custom'
  },
  'AboutUsSection': {
    label: 'About Us Section',
    data_table: 'custom_section_data',
    description: 'About us with mission, vision, and impact statistics',
    isSpecial: false,
    category: 'content',
    badge: 'Custom'
  },
  'OurActionSection': {
    label: 'Our Actions Section',
    data_table: 'custom_section_data',
    description: 'Grid of action items with icons and descriptions',
    isSpecial: false,
    category: 'content',
    badge: 'Custom'
  },
  'WhereWeWorkSection': {
    label: 'Where We Work Section',
    data_table: 'custom_section_data',
    description: 'Statistics with map visualization',
    isSpecial: false,
    category: 'content',
    badge: 'Custom'
  },
  'HeroFigureSection': {
    label: 'Hero with Figure',
    data_table: 'custom_section_data',
    description: 'Hero section with image and rich text content',
    isSpecial: false,
    category: 'banner',
    badge: 'Custom'
  },
  'CardsSection': {
    label: 'Cards Section',
    data_table: 'custom_section_data',
    description: 'Cards with images, titles, and action buttons',
    isSpecial: false,
    category: 'content',
    badge: 'Custom'
  },
  'ContactOfficeSection': {
    label: 'Contact Office Section',
    data_table: 'custom_section_data',
    description: 'Office locations with contact details and map',
    isSpecial: false,
    category: 'contact',
    badge: 'Custom'
  },
  'AddressSection': {
    label: 'Address Section',
    data_table: 'custom_section_data',
    description: 'Addresses with map coordinates and contact info',
    isSpecial: false,
    category: 'contact',
    badge: 'Custom'
  },
  'ContactReachSection': {
    label: 'Contact Reach Section',
    data_table: 'custom_section_data',
    description: 'Contact form with supporting image',
    isSpecial: false,
    category: 'contact',
    badge: 'Custom'
  },
  'JobsSection': {
    label: 'Jobs Section',
    data_table: 'custom_section_data',
    description: 'Display job listings with custom title, description, and display limit',
    isSpecial: false,
    category: 'content',
    badge: 'Custom'
  },
  'FollowUSSection': {
    label: 'Follow Us Section',
    data_table: 'custom_section_data',
    description: 'Social media links and follow buttons',
    isSpecial: false,
    category: 'contact',
    badge: 'Custom'
  },
  'LegalSection': {
    label: 'Legal Section',
    data_table: 'custom_section_data',
    description: 'Legal status information with background image',
    isSpecial: false,
    category: 'content',
    badge: 'Custom'
  },
  'ProgramImpactSection': {
    label: 'Program Impact Section',
    data_table: 'custom_section_data',
    description: 'Program impact statistics with SDG images',
    isSpecial: false,
    category: 'content',
    badge: 'Custom'
  },
  'ImageGallerySection': {
    label: 'Image Gallery Section',
    data_table: 'custom_section_data',
    description: 'Image gallery with grid layout and lightbox',
    isSpecial: false,
    category: 'media',
    badge: 'Custom'
  },
  'VideoGallerySection': {
    label: 'Video Gallery Section',
    data_table: 'custom_section_data',
    description: 'Video gallery with thumbnails and play functionality',
    isSpecial: false,
    category: 'media',
    badge: 'Custom'
  },
};

const CATEGORY_LABELS = {
  banner: 'Banners & Hero Sections',
  content: 'Content Sections',
  contact: 'Contact & Social',
  media: 'Media & Gallery',
};

const CATEGORY_ICONS = {
  banner: '🎨',
  content: '📄',
  contact: '📞',
  media: '🎬',
};

const AddSectionModal = ({ isOpen, onClose, pageId, onSuccess }) => {
  const [selectedComponent, setSelectedComponent] = useState('');
  const [sectionKey, setSectionKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'special', 'custom'

  const searchInputRef = useRef(null);
  const modalRef = useRef(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Generate suggested section key
  useEffect(() => {
    if (selectedComponent) {
      const baseKey = selectedComponent
        .replace('Section', '')
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')
        .replace(/-+/g, '-');
      setSuggestedKey(baseKey);
      setSectionKey(baseKey);
    }
  }, [selectedComponent]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedComponent('');
      setSectionKey('');
      setErrors({});
      setSearchQuery('');
      setSelectedCategory('all');
      setActiveTab('all');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const [suggestedKey, setSuggestedKey] = useState('');

  // Filter sections based on search, category, and tab
  const filteredSections = useMemo(() => {
    let sections = Object.entries(SECTION_OPTIONS);

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      sections = sections.filter(([key, opt]) =>
        opt.label.toLowerCase().includes(query) ||
        opt.description.toLowerCase().includes(query) ||
        key.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      sections = sections.filter(([, opt]) => opt.category === selectedCategory);
    }

    // Filter by tab
    if (activeTab === 'special') {
      sections = sections.filter(([, opt]) => opt.isSpecial === true);
    } else if (activeTab === 'custom') {
      sections = sections.filter(([, opt]) => opt.isSpecial === false);
    }

    return sections;
  }, [searchQuery, selectedCategory, activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const option = SECTION_OPTIONS[selectedComponent];

    const data = {
      page_id: pageId,
      component: selectedComponent,
      section_key: sectionKey,
      data_table: option.data_table,
      is_enabled: true,
      custom_props: {}
    };

    router.post(
      route('backend.cms.sections.store'),
      data,
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setIsSubmitting(false);
          showToast('success', '✅ Created!', 'Section created successfully.', 2000);
          if (onSuccess) onSuccess();
          onClose();
        },
        onError: (errors) => {
          setIsSubmitting(false);
          setErrors(errors);
          const errorMessage = errors.message || 'Failed to create section.';
          showToast('error', '❌ Creation Failed', errorMessage, 4000);
        },
      }
    );
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedOption = selectedComponent ? SECTION_OPTIONS[selectedComponent] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto animate-slideUp"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <FaPlus className="text-blue-600 text-lg" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">Add New Section</h2>
              <p className="text-sm text-gray-500 mt-0.5">Choose a section type to add to this page</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections by name or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All ({Object.keys(SECTION_OPTIONS).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'custom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              📝 Custom ({Object.values(SECTION_OPTIONS).filter(opt => !opt.isSpecial).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('special')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'special'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ⭐ Special ({Object.values(SECTION_OPTIONS).filter(opt => opt.isSpecial).length})
            </button>

            {/* Category Filter (only show when not searching) */}
            {!searchQuery && (
              <>
                <span className="w-px bg-gray-300 mx-2" />
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                  const count = Object.values(SECTION_OPTIONS).filter(opt => opt.category === key).length;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${selectedCategory === key
                          ? 'bg-purple-100 text-purple-700 border border-purple-300'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                        }`}
                    >
                      {CATEGORY_ICONS[key]} {label} ({count})
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Section Type Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Section Type <span className="text-red-500">*</span>
            </label>

            {/* Grid of section options */}
            {filteredSections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                {filteredSections.map(([key, opt]) => {
                  const isSelected = selectedComponent === key;
                  const Icon = SECTION_ICONS[key] || FaCode;
                  const badgeColor = opt.isSpecial
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700';

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedComponent(key);
                        setErrors({});
                      }}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                            {opt.label}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${badgeColor} shrink-0`}>
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{opt.description}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                          {opt.data_table}
                        </p>
                      </div>
                      {isSelected && (
                        <FaCheckCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No sections found matching your filters</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setActiveTab('all');
                  }}
                  className="text-blue-600 hover:underline text-sm mt-1"
                >
                  Clear filters
                </button>
              </div>
            )}

            {errors.component && (
              <p className="mt-1 text-sm text-red-500">{errors.component}</p>
            )}
          </div>

          {/* Selected Section Details */}
          {selectedOption && (
            <div className="mb-4 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  {selectedComponent && React.createElement(SECTION_ICONS[selectedComponent] || FaCode, {
                    className: "text-blue-600 text-xl"
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-800">{selectedOption.label}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedOption.isSpecial
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                      {selectedOption.isSpecial ? '⭐ Special' : '📝 Custom'}
                    </span>
                    {selectedOption.data_table === 'shared_data' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        ♻️ Shared
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedOption.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaDatabase size={12} />
                      <code className="px-1.5 py-0.5 bg-white/70 rounded">{selectedOption.data_table}</code>
                    </span>
                    {selectedOption.isSpecial && (
                      <span className="flex items-center gap-1 text-orange-600">
                        <FaExclamationTriangle size={12} />
                        Data managed externally
                      </span>
                    )}
                    {!selectedOption.isSpecial && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <FaCheckCircle size={12} />
                        Auto-generates template data
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Key */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Section Key <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaTag size={14} />
              </div>
              <input
                type="text"
                value={sectionKey}
                onChange={(e) => setSectionKey(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.section_key ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="e.g., about-us, our-programs, banner"
                required
              />
            </div>
            {errors.section_key && (
              <p className="mt-1 text-sm text-red-500">{errors.section_key}</p>
            )}
            {selectedComponent && (
              <div className="mt-1.5 flex items-center gap-2">
                <p className="text-xs text-gray-400">
                  💡 Suggested: <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono">{suggestedKey}</code>
                </p>
                <button
                  type="button"
                  onClick={() => setSectionKey(suggestedKey)}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Use this
                </button>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-400">Unique identifier (lowercase with hyphens). Cannot be changed later.</p>
          </div>

          {/* Info Box */}
          {selectedOption && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-700">What happens next?</h4>
                  <ul className="mt-1 space-y-1 text-sm text-gray-600">
                    {selectedOption.isSpecial ? (
                      <>
                        <li className="flex items-start gap-2">
                          <FaArrowRight className="text-purple-500 mt-0.5 shrink-0" size={12} />
                          <span>The section will reference existing data from <strong>{selectedOption.data_table}</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FaArrowRight className="text-purple-500 mt-0.5 shrink-0" size={12} />
                          <span>No new data will be created - edit the source data directly</span>
                        </li>
                        {selectedOption.data_table === 'shared_data' && (
                          <li className="flex items-start gap-2">
                            <FaArrowRight className="text-green-500 mt-0.5 shrink-0" size={12} />
                            <span>Changes will reflect on all pages using this shared data</span>
                          </li>
                        )}
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <FaArrowRight className="text-blue-500 mt-0.5 shrink-0" size={12} />
                          <span>A new <strong>custom data entry</strong> will be created with pre-filled template</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FaArrowRight className="text-blue-500 mt-0.5 shrink-0" size={12} />
                          <span>You can customize the content after creation in the section editor</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FaArrowRight className="text-blue-500 mt-0.5 shrink-0" size={12} />
                          <span>Images and content can be managed directly in this section</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedComponent}
              className={`px-6 py-2.5 rounded-lg text-white transition-all flex items-center gap-2 ${isSubmitting || !selectedComponent
                  ? 'bg-blue-400 cursor-not-allowed opacity-70'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus size={14} />
                  Create Section
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSectionModal;