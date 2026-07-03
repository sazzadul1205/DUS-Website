// resources/js/components/Shared/DynamicSectionRenderer.jsx

/**
 * ============================================
 * DYNAMIC SECTION RENDERER
 * ============================================
 * 
 * PURPOSE:
 * - Dynamically loads and renders a section component
 * - Passes the correct data to the section based on configuration
 * - Handles lazy loading with Suspense
 * - Parses custom props from section configuration
 * 
 * DATA FLOW:
 * 1. Receives section configuration from pageData
 * 2. Looks up the component in SECTION_COMPONENTS registry
 * 3. Determines what data to pass based on data_table and data_key
 * 4. Renders the component with the resolved props
 * 
 * PROP RESOLUTION LOGIC:
 * 1. If config.isMultiProp: Pass multiple props from pageData
 * 2. Else if propName and dataKey: Pass dataKey as propName
 * 3. Else if propName: Pass pageData[propName] as prop
 * 4. Fallback: Try to find data in pageData by various keys
 * 
 * ============================================
 */

// React
import React, { Suspense } from 'react';

// Import section loader
import SectionLoader from './SectionLoader';

// Import section registry
import { SECTION_COMPONENTS, SECTION_CONFIGS } from '../../config/sectionRegistry';

/**
 * DynamicSectionRenderer Component
 * 
 * @param {Object} props
 * @param {Object} props.section - Section configuration from API
 *   - id: Unique section ID
 *   - component: Component name (e.g., 'HomeBanner', 'FAQSection')
 *   - propName: Name of the prop the component expects (e.g., 'data')
 *   - dataKey: Key to look for in pageData
 *   - custom_props: JSON string of custom props
 *   - data_table: Where to get data (shared_data, custom_section_data, etc.)
 * @param {Object} props.pageData - All page data from DynamicPage
 * @param {Object} props.globalProps - Global props (storageUrl, sharedData, etc.)
 * 
 * @returns {JSX.Element} Rendered section with Suspense
 */
const DynamicSectionRenderer = ({
  section,
  pageData,
  globalProps = {}
}) => {
  // ============================================
  // EXTRACT SECTION CONFIG
  // ============================================
  const {
    id,
    component: componentName,
    propName,
    dataKey,
    // Support both field names (custom_props from DB, customProps from frontend)
    custom_props: customPropsFromDb,
    customProps: customPropsFromFrontend,
    // isSpecialSection is intentionally omitted - reserved for future use
    // If needed in the future, uncomment the line below:
    // isSpecialSection,
  } = section;

  // ============================================
  // GET COMPONENT FROM REGISTRY
  // ============================================
  const Component = SECTION_COMPONENTS[componentName];

  // If component doesn't exist, skip rendering
  if (!Component) {
    console.warn(`[DynamicSectionRenderer] Component "${componentName}" not found in registry`);
    return null;
  }

  // ============================================
  // PARSE CUSTOM PROPS
  // ============================================
  // Use the correct field name (prefer custom_props from database)
  const rawCustomProps = customPropsFromDb || customPropsFromFrontend || {};

  let parsedCustomProps = {};
  if (typeof rawCustomProps === 'string') {
    try {
      const parsed = JSON.parse(rawCustomProps);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        parsedCustomProps = parsed;
      }
    } catch (e) {
      console.warn(`[DynamicSectionRenderer] Failed to parse customProps for ${componentName}:`, e);
    }
  } else if (rawCustomProps && typeof rawCustomProps === 'object' && !Array.isArray(rawCustomProps)) {
    parsedCustomProps = rawCustomProps;
  }

  // ============================================
  // BUILD COMPONENT PROPS
  // ============================================
  // Start with global props, then override with custom props
  // This allows custom props to override global props if needed
  const baseProps = { ...globalProps, ...parsedCustomProps };

  // Get configuration for this component from sectionRegistry
  const config = SECTION_CONFIGS[componentName];

  // Build component props based on configuration
  const componentProps = { ...baseProps };

  if (config?.isMultiProp) {
    // Multi-prop components: pass multiple props
    config.props.forEach(prop => {
      if (pageData[prop] !== undefined) {
        componentProps[prop] = pageData[prop];
      }
    });
  } else if (propName && dataKey) {
    // Single prop with explicit dataKey
    let dataValue = pageData[dataKey];

    // Try kebab-case version of dataKey (for camelCase to kebab conversion)
    if (dataValue === undefined && dataKey) {
      const kebabKey = dataKey.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      dataValue = pageData[kebabKey];
    }

    // Try using propName as fallback
    if (dataValue === undefined && propName) {
      dataValue = pageData[propName];
      const kebabPropName = propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      if (dataValue === undefined) {
        dataValue = pageData[kebabPropName];
      }
    }

    componentProps[propName] = dataValue;
  } else if (propName) {
    // Single prop: try to find data by propName
    let dataValue = pageData[propName];
    if (dataValue === undefined) {
      const kebabPropName = propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      dataValue = pageData[kebabPropName];
    }
    componentProps[propName] = dataValue;
  }

  // ============================================
  // FALLBACK: Try to find data by various keys
  // ============================================
  // If still no data found, try a series of possible keys
  if (componentProps[propName] === undefined) {
    const possibleKeys = [
      section.data_key,
      propName,
      section.data_key?.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
      propName?.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
      componentName.replace('Section', '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    ];

    for (const key of possibleKeys) {
      if (key && pageData[key] !== undefined) {
        componentProps[propName || 'data'] = pageData[key];
        break;
      }
    }
  }

  // ============================================
  // RENDER WITH SUSPENSE (for lazy loading)
  // ============================================
  // Suspense handles the loading state while the lazy component loads
  return (
    <Suspense fallback={<SectionLoader message={`Loading ${id}...`} />}>
      <Component {...componentProps} />
    </Suspense>
  );
};

export default DynamicSectionRenderer;