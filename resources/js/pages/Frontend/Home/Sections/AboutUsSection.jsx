// js/pages/Frontend/Home/Sections/AboutUsSection.jsx

// React
import React from 'react';

// Arrow Icon
import ArrowIcon from './ArrowIcon';

const AboutUsSection = ({ aboutUsData }) => {
  return (
    <section
      id='about-us'
      className='flex justify-between items-stretch bg-white gap-15 px-50 py-37.5'
    >

      {/* Left Section - Text Content */}
      <div className='w-1/2 flex flex-col justify-between space-y-15'>

        {/* About Section */}
        <div>
          <h1 className='bricolage-grotesque font-800 text-[40px] text-black pb-6'>
            {aboutUsData.section.title}
          </h1>
          <p className='bricolage-grotesque font-400 text-[20px] text-[#515151] leading-snug pb-7.5'>
            {aboutUsData.section.description}
          </p>

          <button className='bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] p-4 font-600 text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300'>
            <span>{aboutUsData.section.button.text}</span>
            <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </button>
        </div>

        {/* Mission Section */}
        <div>
          <h1 className='bricolage-grotesque font-600 text-[24px] text-[#080C14] pb-6'>
            {aboutUsData.mission.title}
          </h1>
          <div className='grid grid-cols-2 gap-2.5'>
            {aboutUsData.mission.items.map((item) => (
              <div key={item.id} className='bg-[#F5F5F5] flex p-6 rounded-xl gap-4 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
                <img
                  src={item.icon}
                  alt={item.alt}
                  className='w-7.5 h-7.5 group-hover:scale-110 transition-transform duration-300'
                />
                <div>
                  <h3 className=' bricolage-grotesque font-600 text-xl text-[#080C14] mb-2'>{item.title}</h3>
                  <p className=' bricolage-grotesque font-400 text-[16px] text-[#515151] leading-relaxed'>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div>
          <h1 className='bricolage-grotesque font-600 text-[24px] text-[#080C14] pb-6'>
            {aboutUsData.impact.title}
          </h1>
          <div className='grid grid-cols-3 gap-5 rounded-md'>
            {aboutUsData.impact.stats.map((stat) => (
              <div key={stat.id} className='bg-[#F5F5F5] py-7.5 rounded-xl group hover:bg-[#009BE2] transition-all duration-300 hover:-translate-y-1'>
                <h3 className='flex items-end font-600 text-[50px] text-[#080C14] text-center justify-center group-hover:text-white transition-colors duration-300'>
                  {stat.value}
                  <span className='text-[16px] pb-3 group-hover:text-white transition-colors duration-300'>
                    {stat.suffix}
                  </span>
                </h3>
                <p className='font-600 text-[16px] text-[#080C14] text-center justify-center group-hover:text-white transition-colors duration-300'>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Image (matches full height of text section) */}
      <div className='w-1/2 flex'>
        <img
          src={aboutUsData.image.src}
          alt={aboutUsData.image.alt}
          className='w-full h-full object-cover rounded-4xl'
        />
      </div>
    </section>
  );
};

export default AboutUsSection;