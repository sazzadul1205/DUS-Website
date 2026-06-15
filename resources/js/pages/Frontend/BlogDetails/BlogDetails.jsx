// resources/js/Pages/Frontend/BlogDetails/BlogDetails.jsx

import React from 'react';

// Inertia
import { Head, Link } from '@inertiajs/react';
import { Suspense, lazy } from "react";

import { CiCalendar } from "react-icons/ci";
import { FaRegClock, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// ============================================
// LAZY LOAD SECTIONS - Only load when needed
// ============================================
const BlogSection = lazy(() => import("../../../Sections/BlogSection/BlogSection"));
const UpcomingEventsSection = lazy(() => import("../../../Sections/UpcomingEventsSection/UpcomingEventsSection"));

// ============================================
// SECTION ORDER CONFIGURATION (JSON)
// ============================================
const SECTION_ORDER_CONFIG = {
  sections: [
    {
      id: "banner",
      component: "BannerSection", // Special component
      isBannerSection: true,
      enabled: true,
      order: 1,
    },
    {
      id: "blog-content",
      component: "BlogContentSection", // Special component
      isBlogContentSection: true,
      enabled: true,
      order: 2,
      customProps: {
        bgColor: 'bg-white',
        paddingY: 'py-12 lg:py-16',
        paddingX: 'px-4',
      }
    },
    {
      id: "related-blogs",
      component: BlogSection,
      enabled: true,
      propName: "blogPosts",
      dataKey: "relatedBlogs",
      order: 3,
      customProps: {
        bgColor: 'bg-[#F5F5F5]',
        sectionTitle: 'Related Blogs',
        // paddingY: 'py-12 sm:py-16 md:py-20 lg:py-37.5',
        // paddingX: 'px-5 sm:px-8 md:px-12 lg:px-50',
      }
    },
    {
      id: "upcoming-events",
      component: UpcomingEventsSection,
      enabled: true,
      propName: "eventsData",
      dataKey: "upcomingEventsData",
      order: 4,
      customProps: {
        // bgColor: 'bg-[#FFFFFF]',
        // paddingY: 'py-12 sm:py-16 md:py-25 lg:py-37.5',
        // paddingX: 'px-5 sm:px-10 md:px-20 lg:px-50',
      }
    },
  ],
};

// Banner Section Component
const BannerSection = ({ bannerData, blogData, storageUrl }) => {
  const tagColors = [
    "bg-[#3866FF]", "bg-[#503AF2]", "bg-[#00B894]",
    "bg-[#FF6B6B]", "bg-[#FDCB6E]", "bg-[#6C5CE7]",
  ];

  return (
    <section className="relative isolate w-full h-125 overflow-hidden bg-[#080C14]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {bannerData?.background?.src && (
          <img
            src={bannerData.background.src}
            alt={bannerData.background.alt || 'Banner background'}
            className="h-full w-full object-cover object-center"
          />
        )}
        <div className={`absolute inset-0 ${bannerData?.overlay?.darkOverlay || 'bg-black/60'}`}>
          {bannerData?.overlay?.gradient && (
            <div className={`absolute inset-0 ${bannerData.overlay.gradient}`} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-275 mx-auto px-4 pt-24 sm:pt-28 lg:pt-32 h-full flex flex-col items-center justify-start text-center">
        {/* Tags */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap mb-5">
          {blogData?.tags?.length > 0 ? (
            blogData.tags.map((tag, index) => (
              <span
                key={index}
                className={`text-white text-[12px] sm:text-[13px] font-semibold px-2 py-1 rounded-md ${tagColors[index % tagColors.length]}`}
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-white bg-[#3866FF] text-[12px] sm:text-[13px] font-semibold px-2 py-1 rounded-md">
              Blog Post
            </span>
          )}
        </div>

        {/* Main Heading */}
        <h1 className="text-white font-bold text-[40px] sm:text-[54px] lg:text-[100px] leading-[1.05] mb-4 max-w-380">
          {blogData?.title || 'Blog Post'}
        </h1>

        {/* Meta */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-white text-[12px] sm:text-[14px] font-semibold">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              <img
                src="https://placehold.co/20x20"
                alt="Author"
                className="w-5 h-5 object-cover"
              />
              <div className="absolute inset-0 bg-[#503AF2]/40" />
            </div>
            <p className="flex items-center">
              BY :
              <Link className="underline pl-1">
                {blogData?.createdBy || 'ADMIN'}
              </Link>
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <CiCalendar className="text-base" />
            <span>{blogData?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
          </div>

          {/* Read time */}
          <div className="flex items-center gap-2">
            <FaRegClock className="text-base" />
            <span>{blogData?.timerRead || '5 MIN READ'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Blog Content Section Component
const BlogContentSection = ({ blogData, storageUrl, bgColor = 'bg-white', paddingY = 'py-12 lg:py-16', paddingX = 'px-4', sectionClassName = '', sectionId = 'blog-content' }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${storageUrl}/${imagePath}`;
  };

  const renderHTML = (htmlString) => ({ __html: htmlString });

  if (!blogData) return null;

  return (
    <section id={sectionId} className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}>
      {/* Blog main image */}
      <div className="relative z-10 w-275 mx-auto">
        <img
          src={getImageUrl(blogData?.image) || "https://placehold.co/1100x500"}
          alt={blogData?.title || "Blog main image"}
          className="w-full h-125 object-cover object-center rounded-[28px] shadow-2xl -mt-16"
        />
      </div>

      {/* Blog section */}
      <div className="max-w-275 mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-25">
          {/* Social media icons */}
          <div className="hidden lg:flex flex-col items-center gap-4 pt-2 sticky top-25">
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <FaFacebookF className="text-sm" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <FaLinkedinIn className="text-sm" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#080C14] text-white flex items-center justify-center hover:bg-[#009BE2] transition-colors">
              <FaInstagram className="text-sm" />
            </a>
          </div>

          {/* Blog content */}
          <div className="flex-1">
            <div
              className="bricolage-grotesque prose prose-sm sm:prose-base lg:prose-lg max-w-none
                prose-headings:font-700 prose-headings:text-[#080C14]
                prose-p:text-[#333333] prose-p:leading-relaxed
                prose-ul:text-[#333333] prose-ul:leading-relaxed
                prose-li:text-[#333333] prose-li:leading-relaxed
                prose-strong:text-[#009BE2]"
              dangerouslySetInnerHTML={renderHTML(blogData?.fullContent)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Loading fallback component
const SectionLoader = () => (
  <div className="w-full py-20 flex justify-center items-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#515151] font-400">Loading section...</p>
    </div>
  </div>
);

const BlogDetails = ({
  // Shared
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page Specific
  slug,
  blogData,
  bannerData,
  relatedBlogs,
  upcomingEventsData,
}) => {

  // Prepare data mapping
  const sectionDataMap = {
    relatedBlogs,
    bannerData,
    upcomingEventsData,
    blogData,
    storageUrl,
  };

  // Get enabled sections sorted by order
  const getSectionsToRender = () => {
    return SECTION_ORDER_CONFIG.sections
      .filter(section => section.enabled === true)
      .sort((a, b) => a.order - b.order);
  };

  const sectionsToRender = getSectionsToRender();

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={`${blogData?.title || 'Blog Details'} | DUS - Dwip Unnayan Society | Empowering Communities`} />

      <Suspense fallback={<SectionLoader />}>
        {sectionsToRender.map((section) => {
          // Handle banner section
          if (section.isBannerSection) {
            return (
              <BannerSection
                key={section.id}
                bannerData={sectionDataMap.bannerData}
                blogData={sectionDataMap.blogData}
                storageUrl={sectionDataMap.storageUrl}
              />
            );
          }

          // Handle blog content section
          if (section.isBlogContentSection) {
            const ContentComp = BlogContentSection;
            const props = {
              blogData: sectionDataMap.blogData,
              storageUrl: sectionDataMap.storageUrl,
              ...(section.customProps || {})
            };
            return <ContentComp key={section.id} {...props} />;
          }

          // Handle regular section components
          const SectionComponent = section.component;
          const sectionData = sectionDataMap[section.dataKey];

          if (!SectionComponent) {
            console.warn(`Missing component for: ${section.id}`);
            return null;
          }

          // For sections that don't require data (like those with defaults)
          if (!sectionData && section.id !== 'blog-section') {
            console.warn(`Missing data for: ${section.id}`);
            return null;
          }

          // Merge the required prop with custom props from config
          const props = {
            [section.propName]: sectionData,
            ...(section.customProps || {})
          };

          return <SectionComponent key={section.id} {...props} />;
        })}
      </Suspense>
    </PublicLayout>
  );
};

export default BlogDetails;