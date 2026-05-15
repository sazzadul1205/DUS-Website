// js/pages/Frontend/Home/Sections/StoriesSection.jsx

// React
import React, { useRef, useEffect, useState } from 'react';

// Arrow Icon
import ArrowIcon from './ArrowIcon';

const StoriesSection = ({ storiesData }) => {
  // State for drag scrolling
  const scrollContainerRef = useRef(null);

  // State for drag scrolling
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Mouse/Touch drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  // Mouse/Touch drag scrolling
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Mouse/Touch drag scrolling
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag scrolling
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  // Touch drag scrolling
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Drag scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseleave', handleMouseUp);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseleave', handleMouseUp);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleMouseUp);
      }
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <section
      id='stories'
      className='bg-[#F5F5F5] py-37.5'
    >
      {/* Section Header - Full width with left padding for content alignment */}
      <div className="text-center max-w-7xl mx-auto px-50">
        <h3 className='bricolage-grotesque font-extrabold text-[50px] text-center text-[#080C14] pb-5'>
          {storiesData.section.title}
        </h3>
        <p className='bricolage-grotesque font-400 text-[20px] mx-auto max-w-200 text-center text-[#515151] pb-15'>
          {storiesData.section.description}
        </p>
      </div>

      {/* Full Width Scrollable Container with Hidden Scrollbar */}
      <div
        ref={scrollContainerRef}
        className={`
          flex overflow-x-auto gap-10 px-50 scroll-smooth w-full
          ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          hide-scrollbar
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {storiesData.stories.map((story) => (
          <div
            key={story.id}
            className='bg-[#FFFFFF] p-7.5 w-137.5 rounded-xl shrink-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
          >
            <img
              src={story.image}
              alt={story.title}
              className='h-86.75 rounded-2xl mx-auto object-cover w-full'
            />
            <div className='p-5'>
              <label className='text-[#009BE2] font-400 text-[16px] pb-2 block'>
                {story.date}
              </label>
              <h3 className='text-[#080C14] font-600 text-[36px] leading-snug mb-5 line-clamp-2'>
                {story.title}
              </h3>
              <p className="bricolage-grotesque font-400 text-[16px] lg:text-[20px] text-[#524B48] leading-relaxed line-clamp-5 mb-5">
                {story.description}
              </p>
              <button className="bricolage-grotesque text-[#009BE2] font-600 text-[16px] inline-flex items-center gap-3 group hover:text-[#009BE2]/70 transition-all duration-300 whitespace-nowrap">
                Read More
                <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Scroll hint indicator (subtle gradient on edges) */}
      <div className="relative mt-5 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-[#F5F5F5] to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-[#F5F5F5] to-transparent"></div>
      </div>

      {/* Add this style tag to hide scrollbar globally for this component */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default StoriesSection;