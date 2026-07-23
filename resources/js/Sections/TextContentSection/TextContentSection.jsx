// js/Sections/TextContentSection/TextContentSection.jsx

import React from 'react';
import { sanitizeHTML } from '../../utils/sectionHelpers';

/**
 * Utility to check if a value exists
 */
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * TextContentSection Component
 * 
 * Renders arbitrary HTML content (like legal terms, privacy policy, etc.)
 * using the application's global typography and spacing styles.
 */
const TextContentSection = ({
  data,
  textData,
  textContentSection,
  bgColor = 'bg-white',
  paddingY = 'py-10 sm:py-15 md:py-25 lg:py-37.5',
  paddingX = 'px-5 sm:px-10 md:px-20 lg:px-50',
  maxWidth = 'max-w-4xl lg:max-w-6xl',
  sectionClassName = '',
  sectionId = 'text-content',
}) => {
  // ============================================
  // RESOLVE DATA - Check all possible prop names
  // ============================================
  let resolvedData = data || textData || textContentSection;

  // ============================================
  // NORMALIZE DATA STRUCTURE
  // ============================================
  // Check if the data is wrapped in a 'data' property
  if (resolvedData.data && typeof resolvedData.data === 'object') {
    resolvedData = resolvedData.data;
  }

  // ============================================
  // SAFE DESTRUCTURING
  // ============================================
  const { content = {} } = resolvedData;

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const htmlContent = content.html || content.content || content.text || '';

  // ============================================
  // EARLY RETURN - No content
  // ============================================
  if (!hasValue(htmlContent)) {
    return null;
  }

  // ============================================
  // SANITIZE HTML
  // ============================================
  const sanitizedHtml = sanitizeHTML(htmlContent);

  // ============================================
  // RENDER
  // ============================================
  return (
    <section
      id={sectionId}
      className={`${bgColor} ${paddingX} ${paddingY} ${sectionClassName}`}
    >
      <div className={`mx-auto ${maxWidth}`}>
        <div
          className="max-w-none
                     [&_h1]:text-3xl sm:[&_h1]:text-4xl lg:[&_h1]:text-5xl [&_h1]:font-700 [&_h1]:text-[#080C14] [&_h1]:mt-8 [&_h1]:mb-4
                     [&_h2]:text-2xl sm:[&_h2]:text-3xl lg:[&_h2]:text-4xl [&_h2]:font-700 [&_h2]:text-[#080C14] [&_h2]:mt-8 [&_h2]:mb-4
                     [&_h3]:text-xl sm:[&_h3]:text-2xl lg:[&_h3]:text-3xl [&_h3]:font-700 [&_h3]:text-[#080C14] [&_h3]:mt-6 [&_h3]:mb-3
                     [&_h4]:text-lg sm:[&_h4]:text-xl lg:[&_h4]:text-2xl [&_h4]:font-700 [&_h4]:text-[#080C14] [&_h4]:mt-6 [&_h4]:mb-3
                     [&_h5]:text-base sm:[&_h5]:text-lg lg:[&_h5]:text-xl [&_h5]:font-700 [&_h5]:text-[#080C14] [&_h5]:mt-4 [&_h5]:mb-2
                     [&_h6]:text-sm sm:[&_h6]:text-base lg:[&_h6]:text-lg [&_h6]:font-700 [&_h6]:text-[#080C14] [&_h6]:mt-4 [&_h6]:mb-2
                     [&_p]:text-base sm:[&_p]:text-lg lg:[&_p]:text-xl [&_p]:leading-relaxed [&_p]:mb-4
                     [&_strong]:font-700
                     [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:mb-6
                     [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3 [&_ol]:mb-6
                     [&_li]:text-base sm:[&_li]:text-lg lg:[&_li]:text-xl [&_li]:leading-relaxed
                     [&_a]:underline hover:[&_a]:no-underline
                     [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic
                     [&_code]:bg-gray-100 [&_code]:rounded [&_code]:px-2 [&_code]:py-1 [&_code]:text-sm [&_code]:font-mono
                     [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-8
                     [&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto
                     [&_pre]:overflow-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-all [&_pre]:p-4 [&_pre]:bg-gray-50 [&_pre]:rounded-lg
          "
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    </section>
  );
};

export default TextContentSection;