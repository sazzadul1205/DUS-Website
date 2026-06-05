// pages/About/HeroFigureSection/HeroFigureSection.jsx

// React
import React from 'react';

// Components
import ArrowIcon from '../../../../components/Shared/ArrowIcon';

const HeroFigureSection = ({
  data,                   /// Data object containing section content and image details
  sectionId,              // Optional section ID for anchor linking
  bgImage = null,         // Customizable background image
  bgOverlay = null,       // Customizable overlay for background image
  layout = 'text-left',   // 'text-left' or 'text-right'
  bgColor = 'bg-white',   // Customizable background color
  customClassName = '',   // Custom class name for additional styling
}) => {
  // No default data - expects data to be passed from parent
  if (!data) {
    console.warn('HeroFigureSection: No data provided');
    return null;
  }

  // Destructure data for easier access
  const {
    section,
    content,
    image,
    btn  // Renamed from 'functions' to 'btn'
  } = data;

  // Function to render HTML content safely
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  // Determine image position based on layout
  const isImageLeft = layout === 'text-right';

  // Text content component
  const TextContent = () => (
    <div className='w-full lg:w-1/2 flex flex-col justify-between relative z-10'>
      {/* Only render section title if it exists */}
      {section?.title && (
        <h1 className='bricolage-grotesque font-700 text-[32px] sm:text-[36px] lg:text-[40px] text-black pb-2'>
          {section.title}
        </h1>
      )}

      {/* Render HTML content with 730px max height and ellipsis */}
      {content?.html && (
        <div className="relative">
          <div
            className='bricolage-grotesque text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug overflow-hidden'
            style={{
              maxHeight: '730px',
              display: '-webkit-box',
              WebkitLineClamp: 'unset',
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={renderHTML(content.html)}
          />
          {/* Ellipsis indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      )}

      {/* Render button if btn exists */}
      {btn && btn.text && btn.link && (
        <div className='pt-8'>
          <button
            onClick={() => window.location.href = btn.link}
            className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-4 py-3 sm:px-5 sm:py-3.5 lg:p-4 font-600 text-[14px] sm:text-[15px] lg:text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'
          >
            <span>{btn.text}</span>
            <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </button>
        </div>
      )}
    </div>
  );

  // Image component
  const ImageComponent = () => (
    image && image.src && (
      <div className='w-full lg:w-1/2 flex mt-8 lg:mt-0 relative z-10'>
        <img
          src={image.src}
          alt={image.alt || 'Section image'}
          className={image.className || 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'}
        />
      </div>
    )
  );

  // Generate background style
  const getBackgroundStyle = () => {
    if (bgImage) {
      return {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return {};
  };

  return (
    <section
      id={sectionId}
      className={`relative ${bgColor} ${customClassName}`}
      style={getBackgroundStyle()}
    >
      {/* Background overlay if bgImage is provided */}
      {bgImage && bgOverlay && (
        <div className={`absolute inset-0 ${bgOverlay}`}></div>
      )}

      <div className={`flex flex-col lg:flex-row justify-between items-stretch gap-8 lg:gap-15 px-5 sm:px-10 md:px-20 lg:px-50 py-10 sm:py-15 md:py-25 lg:py-37.5 relative z-10`}>
        {isImageLeft ? (
          <>
            <ImageComponent />
            <TextContent />
          </>
        ) : (
          <>
            <TextContent />
            <ImageComponent />
          </>
        )}
      </div>
    </section>
  );
};

export default HeroFigureSection;