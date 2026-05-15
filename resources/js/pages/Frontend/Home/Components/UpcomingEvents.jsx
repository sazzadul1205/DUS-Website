import React from 'react';
import ArrowIcon from './ArrowIcon';
import { CiLocationOn } from "react-icons/ci";

const UpcomingEvents = () => {
  // In-page JSON data
  const eventsData = {
    section: {
      title: "Upcoming Events & Community Actions",
      description: "Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.",
      button: {
        text: "Explore All Events",
        link: "/events"
      }
    },
    image: {
      src: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
      alt: "Events Image",
      className: "mt-15 rounded-2xl h-139.25 w-auto"
    },
    events: [
      {
        id: 1,
        date: {
          day: "25",
          month: "Apr",
          weekday: "THU",
          dayNumber: "1",
          time: "10:30AM"
        },
        location: "International Convention City Bashundhara - ICCB",
        title: "Participate in our community clean-up day and make a difference together",
        description: "Let's shape the future of the food industry together! Participate at the 9th Food Bangladesh Int'l Expo 2026,",
        link: "/events/community-cleanup"
      },
      {
        id: 2,
        date: {
          day: "28",
          month: "Apr",
          weekday: "SUN",
          dayNumber: "2",
          time: "02:00PM"
        },
        location: "Dhaka University Campus - Dhaka",
        title: "Education for All: Scholarship Distribution Ceremony",
        description: "Join us as we distribute scholarships to underprivileged students and celebrate their achievements in pursuing quality education.",
        link: "/events/scholarship-ceremony"
      },
      {
        id: 3,
        date: {
          day: "05",
          month: "May",
          weekday: "MON",
          dayNumber: "3",
          time: "09:00AM"
        },
        location: "Hatiya Island Community Center - Noakhali",
        title: "Climate Adaptation Workshop for Coastal Communities",
        description: "Learn sustainable farming techniques and disaster preparedness strategies to combat climate change impacts in coastal areas.",
        link: "/events/climate-workshop"
      },
    ]
  };

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

export default UpcomingEvents;