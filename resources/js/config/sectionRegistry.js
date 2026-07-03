// dus-frontend/src/config/sectionRegistry.js

/**
 * ============================================
 * SECTION REGISTRY - Lazy-Loaded Section Components
 * ============================================
 * 
 * PURPOSE:
 * - Central registry of all available section components
 * - Maps section component names to their lazy-loaded imports
 * - Defines how each section receives its props
 * 
 * WHY LAZY LOADING?
 * - Sections are only loaded when needed
 * - Reduces initial bundle size
 * - Improves page load performance
 * 
 * HOW IT WORKS:
 * 1. SECTION_COMPONENTS maps component names to lazy imports
 * 2. DynamicSectionRenderer uses this to load the right component
 * 3. SECTION_CONFIGS defines the prop structure for each component
 * 
 * ADDING A NEW SECTION:
 * 1. Create the section component in src/Sections/YourSection/
 * 2. Import it here using lazy(() => import(...))
 * 3. Add it to SECTION_COMPONENTS
 * 4. Add configuration to SECTION_CONFIGS (if needed)
 * 
 * PROP CONFIGURATION:
 * - propName: The prop name the component expects (e.g., 'data')
 * - isMultiProp: If true, component receives multiple props
 *   - props: Array of prop names the component expects
 * 
 * ============================================
 */

// React
import { lazy } from 'react';

// ============================================
// SECTION COMPONENT REGISTRY
// ============================================

export const SECTION_COMPONENTS = {
  // --- Banner Sections ---
  HomeBanner: lazy(() => import('../Sections/BannerSection/HomeBanner')),
  PageBannerSection: lazy(() => import('../Sections/BannerSection/PageBannerSection')),
  
  // --- Common Sections ---
  FAQSection: lazy(() => import('../Sections/FAQSection/FAQSection')),
  BlogSection: lazy(() => import('../Sections/BlogSection/BlogSection')),
  JobsSection: lazy(() => import('../Sections/JobsSection/JobsSection')),
  CardsSection: lazy(() => import('../Sections/CardsSection/CardsSection')),
  LegalSection: lazy(() => import('../Sections/LegalSection/LegalSection')),
  AddressSection: lazy(() => import('../Sections/AddressSection/AddressSection')),
  AboutUsSection: lazy(() => import('../Sections/AboutUsSection/AboutUsSection')),
  StoriesSection: lazy(() => import('../Sections/StoriesSection/StoriesSection')),
  FollowUSSection: lazy(() => import('../Sections/FollowUSSection/FollowUSSection')),
  OurActionSection: lazy(() => import('../Sections/OurActionSection/OurActionSection')),
  HeroFigureSection: lazy(() => import('../Sections/HeroFigureSection/HeroFigureSection')),
  OurProgramsSection: lazy(() => import('../Sections/OurProgramsSection/OurProgramsSection')),
  WhereWeWorkSection: lazy(() => import('../Sections/WhereWeWorkSection/WhereWeWorkSection')),
  ContactReachSection: lazy(() => import('../Sections/ContactReachSection/ContactReachSection')),
  ContactOfficeSection: lazy(() => import('../Sections/ContactOfficeSection/ContactOfficeSection')),
  ProgramImpactSection: lazy(() => import('../Sections/ProgramImpactSection/ProgramImpactSection')),
  UpcomingEventsSection: lazy(() => import('../Sections/UpcomingEventsSection/UpcomingEventsSection')),
};

// ============================================
// SECTION CONFIGURATIONS
// ============================================
/**
 * Defines how each section receives its props
 * 
 * For most sections, the component expects a single 'data' prop
 * The data is passed from pageData based on the section's data_key
 */
export const SECTION_CONFIGS = {
  // All sections use 'data' as the prop name
  FAQSection: { propName: 'data', isMultiProp: false },
  JobsSection: { propName: 'data', isMultiProp: false },
  HomeBanner: { propName: 'data', isMultiProp: false },
  PageBannerSection: { propName: 'data', isMultiProp: false },
  CardsSection: { propName: 'data', isMultiProp: false },
  LegalSection: { propName: 'data', isMultiProp: false },
  HeroFigureSection: { propName: 'data', isMultiProp: false },
  ContactReachSection: { propName: 'data', isMultiProp: false },
  AboutUsSection: { propName: 'data', isMultiProp: false },
  StoriesSection: { propName: 'data', isMultiProp: false },
  FollowUSSection: { propName: 'data', isMultiProp: false },
  OurActionSection: { propName: 'data', isMultiProp: false },
  WhereWeWorkSection: { propName: 'data', isMultiProp: false },
  ContactOfficeSection: { propName: 'data', isMultiProp: false },
  AddressSection: { propName: 'data', isMultiProp: false },
  ProgramImpactSection: { propName: 'data', isMultiProp: false },
  OurProgramsSection: { propName: 'data', isMultiProp: false },
  UpcomingEventsSection: { propName: 'data', isMultiProp: false },
  
  // BlogSection consumes a single data prop
  BlogSection: { propName: 'data', isMultiProp: false },
};