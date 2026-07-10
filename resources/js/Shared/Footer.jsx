// resources/js/components/Footer.jsx

/**
 * ============================================
 * FOOTER - Site Footer Component
 * ============================================
 * 
 * PURPOSE:
 * - Renders the website footer with all sections
 * - Provides navigation links, social media, and newsletter
 * - Responsive: Desktop grid layout, mobile accordion
 * 
 * SECTIONS:
 * 1. Left Column: Logo, description, social links, address/contact
 * 2. Right Column: Quick Links, Our Programs, Newsletter
 * 
 * DATA STRUCTURE:
 * {
 *   logo: { src, alt, className },
 *   description: string,
 *   socialLinks: [{ iconName, url, hoverColor }],
 *   address: { title, details },
 *   contact: { title, numbers: [] },
 *   email: { title, addresses: [] },
 *   quickLinks: [{ name, url }],
 *   programs: [{ name, url }],
 *   newsletter: { title, placeholder, buttonText },
 *   bottomFooter: { copyright, links: [{ text, url }] },
 *   quickLinkLinkIcon: string,
 *   OurProgramLinkIcon: string
 * }
 * 
 * RESPONSIVE BEHAVIOR:
 * - Desktop: Full layout with side-by-side columns
 * - Mobile: Accordion for Quick Links and Programs
 * 
 * ============================================
 */

// React
import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

// Icons
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

// ============================================
// UTILITY: Check if value exists
// ============================================
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

// ============================================
// ICON MAPPING
// ============================================
// Maps icon names from API to React components
const iconMap = {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter
};

/**
 * Footer Component
 * 
 * @param {Object} props
 * @param {Object} props.footerData - Footer configuration data
 * @param {string} props.storageUrl - Base URL for image storage
 * 
 * @returns {JSX.Element} Rendered footer
 */
const Footer = ({ footerData, storageUrl = '' }) => {
  // ============================================
  // STATE
  // ============================================
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState({
    quickLinks: false,
    programs: false
  });

  // ============================================
  // EARLY RETURN - No data
  // ============================================
  if (!hasValue(footerData)) return null;

  // ============================================
  // DESTRUCTURE DATA
  // ============================================
  const {
    logo = {},
    description = '',
    socialLinks = [],
    address = {},
    contact = {},
    email: emailInfo = {},
    quickLinks = [],
    programs = [],
    newsletter = {},
    bottomFooter = {},
    quickLinkLinkIcon = '',
    OurProgramLinkIcon = ''
  } = footerData;

  // ============================================
  // CHECK FOR CONTENT
  // ============================================
  const hasLogo = hasValue(logo.src);
  const hasDescription = hasValue(description);
  const hasSocialLinks = hasValue(socialLinks);
  const hasAddress = hasValue(address.title) || hasValue(address.details);
  const hasContact = hasValue(contact.title) || hasValue(contact.numbers);
  const hasEmailInfo = hasValue(emailInfo.title) || hasValue(emailInfo.addresses);
  const hasQuickLinks = hasValue(quickLinks);
  const hasPrograms = hasValue(programs);
  const hasNewsletter = hasValue(newsletter.title);
  const hasBottomFooter = hasValue(bottomFooter.copyright) || hasValue(bottomFooter.links);

  // If no content, don't render anything
  if (!hasLogo && !hasDescription && !hasSocialLinks && !hasAddress &&
    !hasContact && !hasEmailInfo && !hasQuickLinks && !hasPrograms && !hasNewsletter) {
    return null;
  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Build image URL with storage path
   */
  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (storageUrl) return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return imagePath;
  };

  /**
   * Split programs into two columns for desktop
   */
  const itemsPerColumn = hasPrograms ? Math.ceil(programs.length / 2) : 0;
  const firstProgramColumn = hasPrograms ? programs.slice(0, itemsPerColumn) : [];
  const secondProgramColumn = hasPrograms ? programs.slice(itemsPerColumn) : [];

  /**
   * Toggle mobile accordion sections
   */
  const toggleMobileSection = (section) => {
    setIsMobileMenuOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  /**
   * Handle newsletter subscription
   * Currently simulates API call with timeout
   * TODO: Connect to actual newsletter API endpoint
   */
  const handleSubscribe = (e) => {
    e.preventDefault();

    // Validate email
    if (!email || !email.includes('@')) {
      setSubmitMessage('Please enter a valid email address');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      setTimeout(() => {
        setSubmitMessage('Successfully subscribed!');
        setEmail('');
        setIsSubmitting(false);
        setTimeout(() => setSubmitMessage(''), 3000);
      }, 1000);
    } catch (error) {
      console.error(error);
      setSubmitMessage('Subscription failed. Please try again.');
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div>
      {/* Main Footer */}
      <footer className='bg-[#080C14] rounded-t-2xl lg:rounded-t-4xl' role="contentinfo">
        <div className='mx-auto flex flex-col lg:flex-row px-5 lg:px-50 pt-10 lg:pt-37.5 gap-8 lg:gap-50'>

          {/* ============================================
              LEFT COLUMN - Logo, Description, Social, Contact
              ============================================ */}
          <div className='w-full lg:w-1/3'>
            {/* Logo */}
            {hasLogo && (
              <div className="flex justify-center lg:justify-start">
                <img
                  src={getImageSrc(logo.src)}
                  alt={logo.alt || 'Footer Logo'}
                  className={logo.className || 'h-auto w-auto'}
                  loading="lazy"
                />
              </div>
            )}

            {/* Description */}
            {hasDescription && (
              <p className='pt-5 text-center lg:text-left text-xs lg:text-sm leading-relaxed text-gray-300 px-4 lg:px-0'>
                {description}
              </p>
            )}

            {/* Social Links */}
            {hasSocialLinks && (
              <div className='pt-5 flex justify-center lg:justify-start gap-3 lg:gap-5' aria-label="Social media links">
                {socialLinks.map((social, index) => {
                  const IconComponent = iconMap[social.iconName];
                  if (!IconComponent) return null;
                  return (
                    <div
                      key={index}
                      className='border border-white rounded-full p-2 transition-transform duration-200 hover:scale-110 hover:border-[#009BE2]'
                    >
                      <a
                        href={social.url}
                        className={`text-xl lg:text-2xl text-white ${social.hoverColor || ''} transition-colors duration-200`}
                        aria-label={social.ariaLabel || social.iconName}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconComponent />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Address, Contact, Email */}
            {(hasAddress || hasContact || hasEmailInfo) && (
              <div className='max-w-full lg:max-w-125 pt-5 space-y-4 text-center lg:text-left'>
                {/* Address */}
                {hasAddress && (
                  <div>
                    <h2 className='text-gray-400 font-semibold mb-2 text-xs lg:text-sm uppercase tracking-wide'>
                      {address.title}
                    </h2>
                    <address className="not-italic text-gray-300 text-xs lg:text-sm leading-relaxed">
                      {address.details}
                    </address>
                  </div>
                )}

                {/* Contact Numbers */}
                {hasContact && hasValue(contact.numbers) && (
                  <div>
                    <h2 className='text-gray-400 font-semibold mb-2 text-xs lg:text-sm uppercase tracking-wide'>
                      {contact.title}
                    </h2>
                    {contact.numbers.map((number, index) => (
                      <a
                        key={index}
                        href={`tel:${number.replace(/\D/g, '')}`}
                        className="block text-gray-300 hover:text-white transition-colors text-xs lg:text-sm mb-1"
                      >
                        {number}
                      </a>
                    ))}
                  </div>
                )}

                {/* Email Addresses */}
                {hasEmailInfo && hasValue(emailInfo.addresses) && (
                  <div>
                    <h2 className='text-gray-400 font-semibold mb-2 text-xs lg:text-sm uppercase tracking-wide'>
                      {emailInfo.title}
                    </h2>
                    {emailInfo.addresses.map((emailAddr, index) => (
                      <a
                        key={index}
                        href={`mailto:${emailAddr}`}
                        className="block text-gray-300 hover:text-white transition-colors break-all text-xs lg:text-sm mb-1"
                      >
                        {emailAddr}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ============================================
              RIGHT COLUMN - Quick Links, Programs, Newsletter
              ============================================ */}
          {(hasQuickLinks || hasPrograms || hasNewsletter) && (
            <div className='w-full lg:w-2/3'>

              {/* DESKTOP: Grid layout for links */}
              {(hasQuickLinks || hasPrograms) && (
                <div className='hidden md:grid md:grid-cols-3 gap-8'>

                  {/* Quick Links */}
                  {hasQuickLinks && (
                    <div>
                      <h2 className='text-white text-xl lg:text-[22px] font-bold mb-5'>Quick Links</h2>
                      <ul className='space-y-3'>
                        {quickLinks.map((link, index) => (
                          <li key={index} className='flex items-center group'>
                            {hasValue(quickLinkLinkIcon) && (
                              <img
                                src={getImageSrc(quickLinkLinkIcon)}
                                alt=""
                                className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                                aria-hidden="true"
                              />
                            )}
                            <Link
                              href={link.url}
                              className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Programs - Column 1 */}
                  {hasPrograms && (
                    <div>
                      <h2 className='text-white text-xl lg:text-[22px] font-bold mb-5'>Our Programs</h2>
                      <ul className='space-y-3'>
                        {firstProgramColumn.map((program, index) => (
                          <li key={index} className='flex items-center group'>
                            {hasValue(OurProgramLinkIcon) && (
                              <img
                                src={getImageSrc(OurProgramLinkIcon)}
                                alt=""
                                className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                                aria-hidden="true"
                              />
                            )}
                            <Link
                              href={program.url}
                              className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                            >
                              {program.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Programs - Column 2 (hidden title for alignment) */}
                  {hasPrograms && secondProgramColumn.length > 0 && (
                    <div>
                      <h2 className='text-xl lg:text-[22px] font-bold mb-5 opacity-0 pointer-events-none invisible'>
                        Our Programs
                      </h2>
                      <ul className='space-y-3'>
                        {secondProgramColumn.map((program, index) => (
                          <li key={index} className='flex items-center group'>
                            {hasValue(OurProgramLinkIcon) && (
                              <img
                                src={getImageSrc(OurProgramLinkIcon)}
                                alt=""
                                className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                                aria-hidden="true"
                              />
                            )}
                            <Link
                              href={program.url}
                              className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                            >
                              {program.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================
                  MOBILE: Accordion for links
                  ============================================ */}
              <div className='md:hidden space-y-4'>
                {/* Quick Links Accordion */}
                {hasQuickLinks && (
                  <div className="border-b border-gray-700">
                    <button
                      onClick={() => toggleMobileSection('quickLinks')}
                      className="flex justify-between items-center w-full py-4 text-white font-bold text-lg"
                    >
                      Quick Links
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen.quickLinks ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isMobileMenuOpen.quickLinks ? 'max-h-96 mb-4' : 'max-h-0'}`}>
                      <ul className='space-y-3'>
                        {quickLinks.map((link, index) => (
                          <li key={index} className='flex items-center group'>
                            {hasValue(quickLinkLinkIcon) && (
                              <img
                                src={getImageSrc(quickLinkLinkIcon)}
                                alt=""
                                className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                                aria-hidden="true"
                              />
                            )}
                            <Link
                              href={link.url}
                              className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Programs Accordion */}
                {hasPrograms && (
                  <div className="border-b border-gray-700">
                    <button
                      onClick={() => toggleMobileSection('programs')}
                      className="flex justify-between items-center w-full py-4 text-white font-bold text-lg"
                    >
                      Our Programs
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen.programs ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isMobileMenuOpen.programs ? 'max-h-96 mb-4' : 'max-h-0'}`}>
                      <ul className='space-y-3'>
                        {programs.map((program, index) => (
                          <li key={index} className='flex items-center group'>
                            {hasValue(OurProgramLinkIcon) && (
                              <img
                                src={getImageSrc(OurProgramLinkIcon)}
                                alt=""
                                className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                                aria-hidden="true"
                              />
                            )}
                            <Link
                              href={program.url}
                              className="hover:text-[#009BE2] transition-colors cursor-pointer text-white font-400 text-[14px]"
                            >
                              {program.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* ============================================
                  NEWSLETTER SECTION
                  ============================================ */}
              {hasNewsletter && (
                <div className='pt-10 mt-5 border-t border-gray-700'>
                  <h2 className='text-xl lg:text-[28px] font-bold text-white text-center lg:text-left'>
                    {newsletter.title}
                  </h2>

                  <form onSubmit={handleSubscribe} className='space-y-3 pt-5'>
                    <label htmlFor="email" className="text-gray-300 text-sm block text-center lg:text-left">
                      Email Address
                    </label>
                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2'>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={newsletter.placeholder || 'Enter your email address'}
                        className="flex-1 py-3 px-4 bg-[#080C14] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009BE2] focus:border-transparent transition-all text-white placeholder:text-gray-500 text-sm lg:text-base"
                        required
                        aria-label="Email address for newsletter"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className='bg-[#009BE2] hover:bg-[#009BE2]/80 disabled:bg-[#009BE2]/50 disabled:cursor-not-allowed px-6 py-3 rounded-md font-semibold text-white transition-all duration-200 text-sm lg:text-base'
                      >
                        {isSubmitting ? 'Subscribing...' : (newsletter.buttonText || 'Subscribe')}
                      </button>
                    </div>
                    {submitMessage && (
                      <p className={`text-sm mt-2 text-center lg:text-left ${submitMessage.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                        {submitMessage}
                      </p>
                    )}
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </footer>

      {/* ============================================
          BOTTOM FOOTER - Copyright & Legal Links
          ============================================ */}
      {hasBottomFooter && (
        <footer className='flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#080C14] border-t border-[#090C40] px-5 lg:px-50 py-6'>
          {/* Copyright */}
          {hasValue(bottomFooter.copyright) && (
            <p className='text-white text-[12px] lg:text-[14px] font-400 text-center sm:text-left'>
              {bottomFooter.copyright}
            </p>
          )}

          {/* Legal Links */}
          {hasValue(bottomFooter.links) && (
            <ul className='flex flex-wrap justify-center gap-4 lg:gap-8 text-white text-[12px] lg:text-[14px] font-400'>
              {bottomFooter.links.map((link, index) => (
                <li
                  key={index}
                  className='hover:text-[#009BE2] cursor-pointer transition-colors duration-200'
                >
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          )}
        </footer>
      )}
    </div>
  );
};

export default Footer;