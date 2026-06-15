// resources/js/Pages/Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

import React from 'react';
import { Head } from "@inertiajs/react";
import { Suspense, lazy } from "react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// ============================================
// LAZY LOAD SECTIONS - Only load when needed
// ============================================
const FAQSection = lazy(() => import("../../../Sections/FAQSection/FAQSection"));
const PageBannerSection = lazy(() => import("../../../Sections/BannerSection/PageBannerSection"));
const UpcomingEventsSection = lazy(() => import("../../../Sections/UpcomingEventsSection/UpcomingEventsSection"));

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
        // sectionId will be dynamically generated
      }
    },
    {
      id: "program-content",
      component: "ProgramContentSection", // Special component
      isProgramContentSection: true,
      enabled: true,
      order: 2,
      customProps: {
        bgColor: 'bg-white',
        paddingY: 'py-37.5',
        paddingX: 'px-100',
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

// Program Content Section Component
const ProgramContentSection = ({
  programData,
  slug,
  bgColor = 'bg-white',
  paddingY = 'py-37.5',
  paddingX = 'px-100',
  sectionClassName = '',
  sectionId = 'program-content',
}) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  if (!programData) return null;

  return (
    <section id={sectionId} className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}>
      {/* Title */}
      <h1 className='font-700 text-[100px] leading-tight pb-12.5'>
        {programData?.title}
      </h1>

      {/* Image - Responsive sizing */}
      {programData?.image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <img
            src={programData.image}
            alt={programData?.title || 'Program image'}
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="bricolage-grotesque prose prose-lg max-w-none
          prose-headings:font-700 prose-headings:text-[#080C14] 
          prose-p:text-[#333333] prose-p:leading-relaxed
          prose-ul:text-[#333333] prose-ul:leading-relaxed
          prose-li:text-[#333333] prose-li:leading-relaxed
          prose-strong:text-[#009BE2]"
        dangerouslySetInnerHTML={renderHTML(programData.content)}
      />
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

const ProjectsAndProgramsDetails = ({
  // Shared data
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page specific data
  slug,
  faqData,
  bannerData,
  programData,
  upcomingEventsData,
}) => {

  // Prepare data mapping
  const sectionDataMap = {
    bannerData,
    faqData,
    upcomingEventsData,
    programData,
    slug,
  };

  // Get enabled sections sorted by order
  const getSectionsToRender = () => {
    // Dynamically update banner sectionId based on slug
    const sections = SECTION_ORDER_CONFIG.sections.map(section => {
      if (section.id === 'banner' && section.customProps) {
        return {
          ...section,
          customProps: {
            ...section.customProps,
            sectionId: `program-${slug}-banner`
          }
        };
      }
      return section;
    });

    return sections
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
      <Head title={`${programData?.title || 'Program'} | DUS - Dwip Unnayan Society`} />

      <Suspense fallback={<SectionLoader />}>
        {sectionsToRender.map((section) => {
          // Handle program content section
          if (section.isProgramContentSection) {
            const ContentComp = ProgramContentSection;
            const props = {
              programData: sectionDataMap.programData,
              slug: sectionDataMap.slug,
              ...(section.customProps || {})
            };
            return <ContentComp key={section.id} {...props} />;
          }

          // Handle regular section components
          const SectionComponent = section.component;
          const sectionData = sectionDataMap[section.dataKey];

          if (!SectionComponent || !sectionData) {
            console.warn(`Missing component or data for: ${section.id}`);
            return null;
          }

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

export default ProjectsAndProgramsDetails;