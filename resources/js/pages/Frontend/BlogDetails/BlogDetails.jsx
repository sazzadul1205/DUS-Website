// resources/js/Pages/Frontend/BlogDetails/BlogDetails.jsx

// React
import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';

// Axios
import axios from 'axios';

// Icons
import { CiCalendar } from "react-icons/ci";
import { FaRegClock, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Components
import DynamicSectionRenderer from '../../../Shared/DynamicSectionRenderer';

// Banner Section Component
const BannerSection = ({ bannerData, blogData, loading, notFound }) => {
  if (loading) {
    return (
      <section className="relative isolate w-full h-125 overflow-hidden bg-[#080C14] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" />
          <p className="mt-4 text-lg">Loading blog details...</p>
        </div>
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="relative isolate w-full h-125 overflow-hidden bg-[#080C14] flex items-center justify-center">
        <div className="text-white text-center max-w-2xl px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Content Not Available</h1>
          <p className="text-lg text-gray-300">The blog post you're looking for is no longer available or has been removed.</p>
          <a href="/" className="inline-block mt-6 bg-[#009BE2] text-white px-6 py-3 rounded-lg hover:bg-[#009BE2]/80 transition-colors">
            Return to Home
          </a>
        </div>
      </section>
    );
  }

  // Normalize blog data
  const normalizedBlogData = {
    title: blogData?.title || 'Blog Post',
    createdBy: blogData?.createdBy || blogData?.author || 'ADMIN',
    date: blogData?.date || blogData?.created_at || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
    timerRead: blogData?.timerRead || blogData?.read_time || '5 MIN READ',
    tags: blogData?.tags || [],
  };

  // Use blog image as banner if bannerData is not available
  const defaultBanner = {
    background: {
      src: blogData?.image || '/storage/OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png',
      alt: blogData?.title || 'Blog Banner'
    },
    overlay: {
      darkOverlay: 'bg-black/60',
      gradient: 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
    }
  };

  const banner = bannerData || defaultBanner;

  return (
    <section className="relative isolate w-full h-125 overflow-hidden bg-[#080C14]">
      <div className="absolute inset-0 z-0">
        {banner?.background?.src && (
          <img
            src={banner.background.src}
            alt={banner.background.alt || 'Banner background'}
            className="h-full w-full object-cover object-center"
          />
        )}
        <div className={`absolute inset-0 ${banner?.overlay?.darkOverlay || 'bg-black/60'}`}>
          {banner?.overlay?.gradient && (
            <div className={`absolute inset-0 ${banner.overlay.gradient}`} />
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-275 mx-auto px-4 pt-24 sm:pt-28 lg:pt-32 h-full flex flex-col items-center justify-start text-center">
        <div className="flex items-center justify-center gap-2.5 flex-wrap mb-5">
          {normalizedBlogData.tags?.length > 0 ? (
            normalizedBlogData.tags.map((tag, index) => {
              const tagColors = [
                "bg-[#3866FF]", "bg-[#503AF2]", "bg-[#00B894]",
                "bg-[#FF6B6B]", "bg-[#FDCB6E]", "bg-[#6C5CE7]",
              ];
              return (
                <span
                  key={index}
                  className={`text-white text-[12px] sm:text-[13px] font-semibold px-2 py-1 rounded-md ${tagColors[index % tagColors.length]}`}
                >
                  {tag}
                </span>
              );
            })
          ) : (
            <span className="text-white bg-[#3866FF] text-[12px] sm:text-[13px] font-semibold px-2 py-1 rounded-md">
              Blog Post
            </span>
          )}
        </div>

        <h1 className="text-white font-bold text-[40px] sm:text-[54px] lg:text-[100px] leading-[1.05] mb-4 max-w-380">
          {normalizedBlogData.title || 'Blog Post'}
        </h1>

        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-white text-[12px] sm:text-[14px] font-semibold">
          <div className="flex items-center gap-2.5">
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              <img src="https://placehold.co/20x20" alt="Author" className="w-5 h-5 object-cover" />
              <div className="absolute inset-0 bg-[#503AF2]/40" />
            </div>
            <p className="flex items-center">
              BY : <span className="pl-1">{normalizedBlogData.createdBy || 'ADMIN'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CiCalendar className="text-base" />
            <span>{normalizedBlogData.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaRegClock className="text-base" />
            <span>{normalizedBlogData.timerRead}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Blog Content Section Component
const BlogContentSection = ({
  blogData,
  storageUrl,
  bgColor,
  paddingY,
  paddingX,
  sectionClassName,
  sectionId,
  notFound
}) => {
  if (notFound) {
    return null;
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    const cleanPath = imagePath.replace(/^\//, '');
    return `${storageUrl}/${cleanPath}`;
  };

  const normalizedBlogData = {
    title: blogData?.title || 'Blog Post',
    image: blogData?.image,
    fullContent: blogData?.fullContent || blogData?.full_content || blogData?.content || '',
  };

  const renderHTML = (htmlString) => ({ __html: htmlString });

  if (!blogData || notFound) {
    return null;
  }

  const imageUrl = getImageUrl(normalizedBlogData.image);

  return (
    <section id={sectionId} className={`${bgColor} ${paddingY} ${paddingX} ${sectionClassName}`}>
      <div className="relative z-10 max-w-275 mx-auto">
        <div className="-mt-16 sm:-mt-20 lg:-mt-24">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={normalizedBlogData.title || "Blog main image"}
              className="w-full h-auto max-h-96 sm:max-h-125 object-cover object-center rounded-[28px] shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/1100x500/080C14/FFFFFF?text=Blog+Image";
              }}
            />
          ) : (
            <div className="w-full h-64 sm:h-96 bg-gray-200 rounded-[28px] flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-275 mx-auto mt-12 sm:mt-16 lg:mt-20">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-25">
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

          <div className="flex-1">
            <div
              className="bricolage-grotesque prose prose-sm sm:prose-base lg:prose-lg max-w-none
                prose-headings:font-700 prose-headings:text-[#080C14]
                prose-p:text-[#333333] prose-p:leading-relaxed
                prose-ul:text-[#333333] prose-ul:leading-relaxed
                prose-li:text-[#333333] prose-li:leading-relaxed
                prose-strong:text-[#009BE2]
                prose-p:mt-4 prose-p:mb-4
                prose-h2:mt-8 prose-h2:mb-4
                prose-h3:mt-6 prose-h3:mb-3"
              dangerouslySetInnerHTML={renderHTML(normalizedBlogData.fullContent)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Not Found Component
const NotFoundContent = () => (
  <div className="max-w-275 mx-auto px-4 py-20 text-center">
    <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
      <div className="text-6xl mb-6">🔍</div>
      <h2 className="text-3xl font-bold text-[#080C14] mb-4">Content Not Found</h2>
      <p className="text-gray-600 text-lg mb-6">
        The blog post you're looking for is no longer available or has been removed.
      </p>
      <a href="/" className="inline-block bg-[#009BE2] text-white font-600 px-8 py-3 rounded-lg hover:bg-[#009BE2]/80 transition-colors">
        Return to Home
      </a>
    </div>
  </div>
);

const BlogDetails = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  sectionConfig,
  pageData: pageDataProp,
  notFound: serverNotFound,
  notFoundMessage,
  ...pageData
}) => {
  const { page } = usePage();
  const slug = page.props.pageSlug || window.location.pathname.split('/').pop();

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(serverNotFound || false);
  const [error, setError] = useState(null);

  // Only fetch if server didn't already determine not found
  useEffect(() => {
    if (serverNotFound) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blogs/${slug}`);

        if (response.data.success && response.data.data) {
          setBlogData(response.data.data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching blog details:', err);
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || 'Failed to load blog details');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogData();
    }
  }, [slug, serverNotFound]);

  // If server already determined not found, show the message
  if (serverNotFound) {
    return (
      <PublicLayout
        topBarData={topBarData}
        navbarData={navbarData}
        footerData={footerData}
        storageUrl={storageUrl}
      >
        <Head title="Blog Not Found | DUS" />
        <NotFoundContent
          icon="📝"
          title="Blog Post Not Available"
          message={notFoundMessage || 'The blog post you are looking for is no longer available or has been removed.'}
          buttonText="Return to Home"
          buttonLink="/"
        />
      </PublicLayout>
    );
  }

  // Use the data from the correct nesting
  const actualPageData = pageDataProp || pageData || {};
  const bannerData = actualPageData.bannerData;

  const sectionsToRender = (sectionConfig?.sections || [])
    .filter(section => section.enabled === true)
    .sort((a, b) => a.order - b.order);

  const renderSpecialComponent = (section) => {
    const { component, customProps = {} } = section;

    if (component === 'BannerSection' || component === 'PageBannerSection') {
      return (
        <BannerSection
          key={section.id}
          bannerData={bannerData}
          blogData={blogData}
          loading={loading}
          notFound={notFound}
          {...customProps}
        />
      );
    }

    if (component === 'BlogContentSection') {
      return (
        <BlogContentSection
          key={section.id}
          blogData={blogData}
          storageUrl={storageUrl}
          notFound={notFound}
          {...customProps}
        />
      );
    }

    return null;
  };

  // Show 404 content if not found (client-side detected)
  if (notFound && !serverNotFound) {
    return (
      <PublicLayout
        topBarData={topBarData}
        navbarData={navbarData}
        footerData={footerData}
        storageUrl={storageUrl}
      >
        <Head title="Blog Not Found | DUS" />
        {sectionsToRender.map((section) => {
          if (section.component === 'BannerSection' || section.component === 'PageBannerSection') {
            return (
              <BannerSection
                key={section.id}
                bannerData={bannerData}
                blogData={null}
                loading={false}
                notFound={true}
                {...section.customProps}
              />
            );
          }
          return null;
        })}
        <NotFoundContent />
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
          <a href="/" className="inline-block mt-6 bg-[#009BE2] text-white px-6 py-3 rounded-lg hover:bg-[#009BE2]/80 transition-colors">
            Return to Home
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
      <Head title={`${blogData?.title || 'Blog Details'} | DUS - Dwip Unnayan Society | Empowering Communities`} />

      {sectionsToRender.map((section) => {
        if (section.isSpecialComponent || section.component === 'BannerSection' || section.component === 'BlogContentSection' || section.component === 'PageBannerSection') {
          return renderSpecialComponent(section);
        }
        return (
          <DynamicSectionRenderer
            key={section.id}
            section={section}
            pageData={actualPageData}
            globalProps={{ storageUrl }}
          />
        );
      })}
    </PublicLayout>
  );
};

export default BlogDetails;