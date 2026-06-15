// resources/js/Pages/Frontend/ProjectsAndPrograms/ProjectsAndPrograms.jsx

// Inertia
import { Head } from "@inertiajs/react";
import { Suspense, lazy } from "react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// ============================================
// LAZY LOAD SECTIONS - Only load when needed
// ============================================
const FAQSection = lazy(() => import("../../../Sections/FAQSection/FAQSection"));
const PageBannerSection = lazy(() => import("../../../Sections/BannerSection/PageBannerSection"));
const OurProgramsSection = lazy(() => import("../../../Sections/OurProgramsSection/OurProgramsSection"));

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
        sectionId: 'projects-programs-banner',
      }
    },
    {
      id: "our-programs",
      component: OurProgramsSection,
      enabled: true,
      propName: "programsData",
      dataKey: "ourProgramsData",
      order: 2,
      customProps: {
        // bgColor: 'bg-white',
        // paddingY: 'py-12 sm:py-16 lg:py-20',
        // paddingX: 'px-5 sm:px-10 md:px-20 lg:px-50',
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

const ProjectsAndPrograms = ({
  // Shared 
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page Specific
  faqData,
  bannerData,
  ourProgramsData,
}) => {

  // Prepare data mapping
  const sectionDataMap = {
    bannerData,
    ourProgramsData,
    faqData,
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
      <Head title="Projects & Programs | DUS - Dwip Unnayan Society | Empowering Communities" />

      <Suspense fallback={<SectionLoader />}>
        {sectionsToRender.map((section) => {
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

export default ProjectsAndPrograms;