// js/pages/Frontend/Home/Sections/JobsSection.jsx

// React
import React, { useState } from 'react';

// React Icons
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuBriefcaseBusiness, LuClock4 } from "react-icons/lu";

// Arrow Icon
import ArrowIcon from './ArrowIcon';

const JobsSection = ({ jobsData }) => {

  // Filters
  const [selectedFilter, setSelectedFilter] = useState("");

  // Handle Filter
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  // Filtered Jobs
  const filteredJobs = selectedFilter === "" || selectedFilter === "all"
    ? jobsData.jobs
    : jobsData.jobs.filter(job => job.type.toLowerCase().replace(" ", "-") === selectedFilter);

  return (
    <section id='jobs' className='bg-[#F5F5F5] py-37.5 px-75'>

      <div className='flex justify-between items-center pb-15 flex-wrap gap-5'>
        <div>
          <h1 className='text-[#080C14] font-800 text-[50px] mb-5'>
            {jobsData.section.title}
          </h1>
          <p className='text-[#515151] font-400 text-[20px]'>
            {jobsData.section.description}
          </p>
        </div>

        <div className="relative min-w-80">
          <select
            name="browseBy"
            id="browseBy"
            value={selectedFilter}
            onChange={handleFilterChange}
            className="w-full appearance-none border border-[#A3A3A3] rounded-[14px] bg-[#F5F5F5] px-6 py-4 pr-12 text-[16px] font-600 text-[#515151] outline-none focus:border-[#009BE2] focus:ring-1 focus:ring-[#009BE2] cursor-pointer transition-all duration-300"
          >
            {jobsData.filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#979797]"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        {filteredJobs.map((job) => (
          <div key={job.id} className='bg-white p-10 rounded-2xl hover:shadow-lg transition-all duration-300'>
            <div className='flex items-start justify-between gap-5 flex-wrap'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 text-[#524B48] text-[14px] font-400 uppercase mb-3 flex-wrap'>
                  <p className='flex items-center gap-1.5'>
                    <LuClock4 />
                    {job.type}
                  </p>

                  <span className='w-1.5 h-px bg-[#524B48] block'></span>

                  <p className='flex items-center gap-1.5'>
                    <LuBriefcaseBusiness />
                    {job.department}
                  </p>

                  <span className='w-1.5 h-px bg-[#524B48] block'></span>

                  <p className='flex items-center gap-1.5'>
                    <HiOutlineLocationMarker />
                    {job.location}
                  </p>
                </div>

                <h3 className='text-[#080C14] text-[32px] font-600 mb-3 leading-tight'>
                  {job.title}
                </h3>

                <p className='text-[#524B48] text-[18px] font-400 leading-relaxed'>
                  {job.description}
                </p>
              </div>

              <div>
                <button className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-7.5 py-4 font-600 text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap">
                  Apply Now
                  <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className='bg-white p-12 rounded-2xl text-center'>
            <p className='text-[#515151] text-[18px] font-400'>
              No jobs found for the selected filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsSection;