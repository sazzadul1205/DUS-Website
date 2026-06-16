// resources/js/Pages/Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

import React from 'react';
import { Head } from "@inertiajs/react";
import PublicLayout from '../../../layouts/PublicLayout';
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// Program Content Section Component
const ProgramContentSection = ({ programData, slug, bgColor, paddingY, paddingX, sectionClassName, sectionId }) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  // Handle both possible prop names
  const data = programData || window.programData;
  if (!data) return null;

  const content = data.fullContentHtml || data.fullContent || data?.content;
  console.log('Rendering ProgramContentSection with content:', content ? 'Yes' : 'No');

  return (
    <section id={sectionId} className={`${bgColor || ''} ${paddingY || ''} ${paddingX || ''} ${sectionClassName || ''}`}>
      <h1 className='font-700 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-tight pb-12.5'>
        {data?.title}
      </h1>

      {data?.image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <img
            src={data.image}
            alt={data?.title || 'Program image'}
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}

      <div
        className="bricolage-grotesque prose prose-lg max-w-none
          prose-headings:font-700 prose-headings:text-[#080C14] 
          prose-p:text-[#333333] prose-p:leading-relaxed prose-p:mb-4
          prose-ul:text-[#333333] prose-ul:leading-relaxed
          prose-li:text-[#333333] prose-li:leading-relaxed
          prose-strong:text-[#009BE2]
          prose-h2:font-700 prose-h2:text-[#080C14] prose-h2:mt-8 prose-h2:mb-4
          prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl"
        dangerouslySetInnerHTML={renderHTML(content)}
      />
    </section>
  );
};

const ProjectsAndProgramsDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  sectionConfig,
  slug,
  ...pageData
}) => {
  const allSections = (sectionConfig?.sections || [])
    .filter(section => section.enabled === true);

  // Separate sections by type
  const bannerSection = allSections.find(section => section.component === 'PageBannerSection');
  const programContentSection = allSections.find(section => section.component === 'ProgramContentSection');
  const otherSections = allSections.filter(
    section => section.component !== 'PageBannerSection' && section.component !== 'ProgramContentSection'
  ).sort((a, b) => a.order - b.order);

  console.log('Banner Section:', bannerSection);
  console.log('Program Content Section:', programContentSection);
  console.log('Other Sections:', otherSections);

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={`${pageData.programContentData?.title || 'Program'} | DUS - Dwip Unnayan Society`} />

      {/* 1. Banner FIRST */}
      {bannerSection && (
        <DynamicSectionRenderer
          key={bannerSection.id}
          section={bannerSection}
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      )}

      {/* 2. Program Content SECOND (right after banner) */}
      {programContentSection && (
        <ProgramContentSection
          key={programContentSection.id}
          programData={pageData.programContentData}
          slug={slug}
          {...programContentSection.customProps}
        />
      )}

      {/* 3. Everything else (FAQ, Events, etc.) at the bottom */}
      {otherSections.map((section) => (
        <DynamicSectionRenderer
          key={section.id}
          section={section}
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      ))}
    </PublicLayout>
  );
};

export default ProjectsAndProgramsDetails;