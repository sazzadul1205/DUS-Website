// js/pages/Frontend/Home/Sections/UpcomingEventsSection.jsx

// React
import React from 'react';

// Arrow Icon
import ArrowIcon from './ArrowIcon';

// Icons
import { CiLocationOn } from "react-icons/ci";

const UpcomingEventsSection = ({ eventsData }) => {

  return (
    <section id='upcoming-events' className='bg-[#FFFFFF] px-50 py-37.5'>
      <div className='flex justify-between gap-25'>
        {/* Left Section */}
        <div className='min-w-150'>
          <div className='gap-6'>
            <h1 className='bricolage-grotesque font-800 text-[50px] text-[#080C14] leading-tight'>
              {eventsData.section.title}
            </h1>

            <p className='text-[#515151] font-400 text-[20px] mt-5 leading-relaxed'>
              {eventsData.section.description}
            </p>

            <button className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-7.5 py-5 font-600 text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap mt-7.5">
              {eventsData.section.button.text}
              <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </button>
          </div>
          <img
            src={eventsData.image.src}
            alt={eventsData.image.alt}
            className={eventsData.image.className}
          />
        </div>

        {/* Right Section - Events List */}
        <div className='w-full space-y-7.5'>
          {eventsData.events.map((event) => (
            <div
              key={event.id}
              className='bg-[#F5F5F5] p-5 rounded-2xl flex gap-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer'
            >
              {/* Date Box */}
              <div className='w-46 bg-[#FFFFFF] rounded-2xl py-8 px-2 text-center min-w-50 group-hover:bg-[#009BE2] transition-colors duration-300'>
                <h3 className='text-[#080C14] font-800 text-[50px] group-hover:text-white transition-colors duration-300'>
                  {event.date.day}
                </h3>

                <h4 className='text-[#080C14] font-800 text-[50px] leading-tight group-hover:text-white transition-colors duration-300'>
                  {event.date.month}
                </h4>

                <p className='text-[#524B48] font-400 text-[16px] group-hover:text-white/90 transition-colors duration-300'>
                  {event.date.weekday} . {event.date.dayNumber}  <span>{event.date.time}</span>
                </p>
              </div>

              {/* Event Details */}
              <div className='w-full p-5'>
                <label className='flex items-center gap-1.5 text-[#524B48] font-400 text-[16px] mb-2'>
                  <CiLocationOn className="text-[#009BE2]" />
                  {event.location}
                </label>
                <h3 className='text-[#080C14] font-600 text-[32px] leading-10 line-clamp-2 mb-2.5'>
                  {event.title}
                </h3>
                <p className='text-[#524B48] font-400 text-[18px] mb-2.5 line-clamp-2'>
                  {event.description}
                </p>
                <button className="bricolage-grotesque text-[#009BE2] font-600 text-[16px] inline-flex items-center gap-3 group/btn hover:text-[#009BE2]/70 transition-all duration-300 whitespace-nowrap">
                  View Event
                  <ArrowIcon className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;