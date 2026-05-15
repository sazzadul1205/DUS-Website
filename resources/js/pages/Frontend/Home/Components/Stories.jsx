import React, { useRef, useEffect, useState } from 'react';
import ArrowIcon from './ArrowIcon';

const Stories = () => {
  // In-page JSON data
  const storiesData = {
    section: {
      title: "Insights, Stories & Impact",
      description: "Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact."
    },
    stories: [
      {
        id: 1,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "June 6, 2023",
        title: "Invest in Kindness, Reap a Better Future",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        link: "/stories/invest-in-kindness"
      },
      {
        id: 2,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "June 6, 2023",
        title: "How to Design a Custom Pool That Perfectly Fits Your Charlotte Backyard",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        link: "/stories/custom-pool-design"
      },
      {
        id: 3,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "June 6, 2023",
        title: "The Benefits of Mindfulness in Daily Life",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        link: "/stories/mindfulness-benefits"
      },
      {
        id: 4,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "July 15, 2023",
        title: "Empowering Women Through Microfinance",
        description: "Discover how small loans are making a big difference in the lives of women entrepreneurs in rural communities. Our microfinance program has helped thousands of women start their own businesses and achieve financial independence.",
        link: "/stories/empowering-women"
      },
      {
        id: 5,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "August 2, 2023",
        title: "Building Resilient Communities Against Climate Change",
        description: "Learn about our initiatives to help coastal communities adapt to the impacts of climate change through sustainable farming practices, disaster preparedness, and ecosystem restoration.",
        link: "/stories/climate-resilience"
      },
      {
        id: 6,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "September 10, 2023",
        title: "Providing Clean Water to Remote Villages",
        description: "Access to clean water is a basic human right. See how our WATSAN program is bringing safe drinking water to communities that have never had it before.",
        link: "/stories/clean-water"
      }
    ]
  };

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse/Touch drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

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

export default Stories;