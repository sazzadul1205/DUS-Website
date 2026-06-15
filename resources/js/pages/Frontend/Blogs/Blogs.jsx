// resources/js/Pages/Frontend/Blogs/Blogs.jsx

import React from 'react';

// Inertia
import { Head } from '@inertiajs/react';
import { Suspense, lazy } from "react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// ============================================
// LAZY LOAD SECTIONS - Only load when needed
// ============================================
const FAQSection = lazy(() => import("../../../Sections/FAQSection/FAQSection"));
const BlogSection = lazy(() => import("../../../Sections/BlogSection/BlogSection"));
const PageBannerSection = lazy(() => import("../../../Sections/BannerSection/PageBannerSection"));

// ============================================
// SECTION ORDER CONFIGURATION (JSON)
// ============================================
const SECTION_ORDER_CONFIG = {
  sections: [
    {
      id: "banner",
      component: PageBannerSection,
      enabled: true,
      propName: "bannerData",
      dataKey: "bannerData",
      order: 1,
      customProps: {
        sectionId: 'blogs-banner',
      }
    },
    {
      id: "blog-section",
      component: BlogSection,
      enabled: true,
      // Remove propName and dataKey since we handle this section specially
      order: 2,
      customProps: {
        // REMOVE the static blogPosts: [] from here
        // bgColor: 'bg-white',
        // paddingY: 'py-10 sm:py-15 md:py-20 lg:py-37.5',
        // paddingX: 'px-5 sm:px-8 md:px-12 lg:px-50',
        // sectionId: 'blog-section',
      }
    },
    {
      id: "faq",
      component: FAQSection,
      enabled: true,
      propName: "faqData",
      dataKey: "faqData",
      order: 3,
      customProps: {
        // bgColor: 'bg-[#F5F5F5]',
        // paddingY: 'py-10 sm:py-15 md:py-20 lg:py-37.5',
        // paddingX: 'px-4 sm:px-6 md:px-10 lg:px-20 xl:px-50',
        // sectionId: 'faq',
      }
    },
  ],
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

const Blogs = ({
  // Shared 
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page Specific
  bannerData,
  faqData,
  mainBlog,
  blogPosts,
}) => {

  // Prepare data mapping
  const sectionDataMap = {
    bannerData,
    faqData,
    mainBlog,
    blogPosts,
  };

  // Get enabled sections sorted by order
  const getSectionsToRender = () => {
    return SECTION_ORDER_CONFIG.sections
      .filter(section => section.enabled === true)
      .sort((a, b) => a.order - b.order);
  };

  // Get sections to render
  const sectionsToRender = getSectionsToRender();

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title="Blogs | DUS - Dwip Unnayan Society | Empowering Communities" />

      {/* Wrap all lazy sections in Suspense */}
      <Suspense fallback={<SectionLoader />}>
        {sectionsToRender.map((section) => {
          const SectionComponent = section.component;

          // Handle BlogSection specially since it needs two props
          if (section.id === 'blog-section') {
            const props = {
              mainBlog: sectionDataMap.mainBlog,
              blogPosts: sectionDataMap.blogPosts,
              ...(section.customProps || {})
            };
            console.log('BlogSection props:', props);
            return <SectionComponent key={section.id} {...props} />;
          }

          // Handle regular sections
          const sectionData = sectionDataMap[section.dataKey];

          if (!SectionComponent || !sectionData) {
            console.warn(`Missing component or data for: ${section.id}`);
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

export default Blogs;