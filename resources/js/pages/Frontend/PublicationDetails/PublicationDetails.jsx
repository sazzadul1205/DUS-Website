// resources/js/Pages/Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails.jsx

// React
import React, { useState, useEffect } from 'react';
import { Head, usePage } from "@inertiajs/react";

// Axios
import axios from 'axios';

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Components
import DynamicSectionRenderer from '../../../Shared/DynamicSectionRenderer';

// Program Content Section Component
const ProgramContentSection = ({ programData, bgColor, paddingY, paddingX, sectionClassName, sectionId, notFound }) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  if (notFound || !programData) return null;

  const data = programData;

  // Try multiple property names (supports both underscore and camelCase)
  const content = data.full_content_html || data.fullContentHtml || data.fullContent || data?.content;

  return (
    <section id={sectionId} className={`${bgColor || ''} ${paddingY || ''} ${paddingX || ''} ${sectionClassName || ''}`}>
      {data?.title && (
        <h1 className='text-black font-700 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-tight pb-12.5'>
          {data.title}
        </h1>
      )}

      {data?.image && (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12.5">
          <img
            src={data.image}
            alt={data?.title || 'Program image'}
            className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-125 object-cover rounded-2xl"
          />
        </div>
      )}

      {content && (
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
      )}
    </section>
  );
};

// Not Found Component
const NotFoundContent = ({ type = 'Program' }) => (
  <div className="max-w-275 mx-auto px-4 py-20 text-center">
    <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
      <div className="text-6xl mb-6">📁</div>
      <h2 className="text-3xl font-bold text-[#080C14] mb-4">{type} Not Found</h2>
      <p className="text-gray-600 text-lg mb-6">
        The {type.toLowerCase()} you're looking for is no longer available or has been removed.
      </p>
      <a href="/projects-programs" className="inline-block bg-[#009BE2] text-white font-600 px-8 py-3 rounded-lg hover:bg-[#009BE2]/80 transition-colors">
        View All {type}s
      </a>
    </div>
  </div>
);

const ProjectsAndProgramsDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  sectionConfig,
  slug: slugProp,
  pageData: incomingPageData,
  ...rest
}) => {
  const { page } = usePage();
  const slug = slugProp || page.props.slug || page.props.pageSlug || window.location.pathname.split('/').pop();

  const [programData, setProgramData] = useState(null);
  const [setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  // Fetch program data from API
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/programs/${slug}`);

        if (response.data.success && response.data.data) {
          setProgramData(response.data.data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching program details:', err);
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || 'Failed to load program details');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProgramData();
    }
  }, [setLoading, slug]);

  const pageData = incomingPageData || rest;

  const allSections = (sectionConfig?.sections || [])
    .filter(section => section.enabled === true);

  const fixedSections = allSections.filter(section => section.isFixedSection === true);
  const dynamicSections = allSections.filter(section => section.isFixedSection !== true)
    .sort((a, b) => a.order - b.order);

  const bannerSection = dynamicSections.find(s => s.component === 'PageBannerSection');
  const otherDynamicSections = dynamicSections.filter(s => s.component !== 'PageBannerSection');

  // Prepare page data with program data
  const enrichedPageData = {
    ...pageData,
    programContentData: programData || pageData.programContentData,
  };

  // Show 404 content if not found
  if (notFound) {
    return (
      <PublicLayout
        topBarData={topBarData}
        navbarData={navbarData}
        footerData={footerData}
        storageUrl={storageUrl}
      >
        <Head title="Program Not Found | DUS" />
        {/* Render banner with not found state - pass null program data */}
        {bannerSection && (
          <DynamicSectionRenderer
            key={bannerSection.id}
            section={{
              ...bannerSection,
              // You can add a custom prop to indicate not found
              customProps: { ...bannerSection.customProps, notFound: true }
            }}
            pageData={{ ...enrichedPageData, programContentData: null }}
            globalProps={{ storageUrl }}
          />
        )}
        <NotFoundContent type="Program" />
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout
        topBarData={topBarData}
        navbarData={navbarData}
        footerData={footerData}
        storageUrl={storageUrl}
      >
        <Head title="Error | DUS" />
        <div className="max-w-275 mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-[#080C14] mb-4">Something Went Wrong</h2>
          <p className="text-gray-600">{error}</p>
          <a href="/projects-programs" className="inline-block mt-6 bg-[#009BE2] text-white px-6 py-3 rounded-lg hover:bg-[#009BE2]/80 transition-colors">
            View All Programs
          </a>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title={`${programData?.title || 'Program'} | DUS - Dwip Unnayan Society`} />

      {/* 1. Banner (first dynamic section) */}
      {bannerSection && (
        <DynamicSectionRenderer
          key={bannerSection.id}
          section={bannerSection}
          pageData={enrichedPageData}
          globalProps={{ storageUrl }}
        />
      )}

      {/* 2. All Fixed Sections (ProgramContentSection, etc.) */}
      {fixedSections.map((section) => {
        if (section.component === 'ProgramContentSection') {
          return (
            <ProgramContentSection
              key={section.id}
              programData={programData}
              slug={slug}
              notFound={notFound}
              {...section.customProps}
            />
          );
        }
        return null;
      })}

      {/* 3. Other Dynamic Sections (FAQ, Events, etc.) */}
      {otherDynamicSections.map((section) => (
        <DynamicSectionRenderer
          key={section.id}
          section={section}
          pageData={enrichedPageData}
          globalProps={{ storageUrl }}
        />
      ))}
    </PublicLayout>
  );
};

export default ProjectsAndProgramsDetails;