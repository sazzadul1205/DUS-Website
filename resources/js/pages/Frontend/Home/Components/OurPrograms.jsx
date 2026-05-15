import React, { useRef, useEffect, useState } from 'react';
import ArrowIcon from './ArrowIcon';

const OurPrograms = () => {
  // Full in-page JSON data
  const programsData = {
    section: {
      title: "Our Programs",
      description: "We design and develop modern web solutions with a professional design using latest technologies and trends.",
      button: {
        text: "View all Projects and programs",
        link: "/projects-programs"
      }
    },
    programs: [
      {
        id: 1,
        title: "Micro-Finance <br /> Program",
        description: "Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Micro-Finance",
        bgColor: "bg-[#E6F3E7]",
        link: "/programs/micro-finance"
      },
      {
        id: 2,
        title: "Climate Change and Disaster Management Program",
        description: "DUS is geographically located at very exposed disaster risk area of Coastal Bangladesh, most of its beneficiaries as well as core staffs of the organization and volunteers including general members are experienced by the influence of topography & living experience with the community, to cope with and face any natural disaster. Further during its lifetime DUS was active in major emergency in relief and rehabilitation programs following Nov. 1970 cyclone relief, 1988/1991-cyclone recovery, 1998 flood response, SIDR 2007 etc. DUS is now moving beyond relief and rehabilitation into institutionalized preparedness, risk reduction and management interventions as well as long term adaptation strategies as consequence of lessons learnt while helping communities cope with the devastating effects of Cyclone SIDR, which struck in November 2007.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Climate+Change",
        bgColor: "bg-[#F3EDE6]",
        link: "/programs/climate-change"
      },
      {
        id: 3,
        title: "Community Radio",
        description: "Strengthening Hatiya Island community for pioneering-connecting and empowering their Voice for Change Bangladesh Government has already acknowledged the importance of community radio and announced the Community Radio Installation, Broadcast & Operation Policy. Bangladesh is the 2nd country in South Asia in formulating policy for Community Radio. Meanwhile, Govt.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        bgColor: "bg-[#E8E6F3]",
        link: "/programs/community-radio"
      },
      {
        id: 4,
        title: "Research and Documentation",
        description: "DUS has a strong Research and Documentation Cell to conduct quality research in diverse areas of human and social development sectors, covering most importantly education, health, livelihood development, environment, human rights and social justice. The R&D cell works as a professional support services unit to fulfill the growing demand for generation and systematic analysis of information in connection with the increasing involvement of DUS in its development activities. Thus it engages in survey and research activities addressing the in-house needs of the organization for exploring and examining the feasible approaches for development, planning, designing, piloting, assessing and improving the implementation and performance of a wide range of projects, and determining the best practices and models of socio-economic interventions.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        bgColor: "bg-[#F3E6EA]",
        link: "/programs/community-radio"
      },
      {
        id: 4,
        title: "WATSAN Program",
        description: "Building on its long experience of providing water and sanitation services to communities, DUS started its Water and Sanitation program with the financial and technical support of the Netherland Govt. The program is implementing in Nangolia Char and Nalerchar under Hatiya Upazilla.  Our goal is to provide sustainable and integrated WATSAN services in the rural areas and break the contamination cycle of unsanitary latrines, contaminated water and unsafe hygiene practices, as well as ensure sustainability and scaling-up of WATSAN services. The program aims to ensure access to sanitation services for four thousand six hundred & five household, safe water services with 250 nos. DTW and hygiene education for around 20000 people of the respective area of DUS.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        bgColor: "bg-[#F2F3E6]",
        link: "/programs/community-radio"
      },
    ]
  };

  const [visibleCards, setVisibleCards] = useState([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = parseInt(entry.target.getAttribute('data-id'));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              if (!prev.includes(cardId)) return [...prev, cardId];
              return prev;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const STICKY_TOP = 140; // same for all cards

  return (
    <section id="our-programs" className="bg-white py-20 px-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-15 gap-5">
        <div className="max-w-250">
          <h1 className="bricolage-grotesque font-700 text-[40px] text-[#080C14] pb-5">
            {programsData.section.title}
          </h1>
          <p className="font-400 text-[20px] text-[#515151]">
            {programsData.section.description}
          </p>
        </div>
        <button className="bricolage-grotesque border border-[#009BE2] rounded-md text-[#009BE2] px-7.5 py-5 font-600 text-[16px] inline-flex items-center gap-3 group hover:bg-[#009BE2] hover:text-white transition-all duration-300 whitespace-nowrap">
          {programsData.section.button.text}
          <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </button>
      </div>

      {/* Cards with perfect stack */}
      <div className="relative min-h-screen mt-32">
        {programsData.programs.map((program, index) => (
          <div
            key={program.id}
            ref={(el) => (cardsRef.current[index] = el)}
            data-id={program.id}
            className={`
              sticky transition-all duration-700 ease-out
              ${visibleCards.includes(program.id)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-32'
              }
            `}
            style={{
              top: `${STICKY_TOP}px`,    // all cards stick at exactly the same height
              zIndex: index,              // first card lowest, last card highest (covers previous)
              marginBottom: 0,            // no gap between cards
            }}
          >
            <div
              className={`flex flex-col lg:flex-row justify-between gap-25 items-center ${program.bgColor} p-25 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-5">
                <h3 className="bricolage-grotesque font-600 text-[32px] lg:text-[46px] text-[#080C14] leading-tight">
                  {program.title.split("<br />").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index !== program.title.split("<br />").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="bricolage-grotesque font-400 text-[16px] lg:text-[20px] text-[#524B48] leading-relaxed line-clamp-9">
                  {program.description}
                </p>
                <button className="bricolage-grotesque flex items-center gap-2.5 font-600 text-[18px] lg:text-[20px] text-[#009BE2] group hover:text-[#080C14] transition-colors duration-300">
                  Read more
                  <ArrowIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </button>
              </div>

              {/* Image */}
              <div className="w-full lg:w-1/2">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-auto lg:h-125 object-cover rounded-3xl shadow-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-20"></div>
    </section>
  );
};

export default OurPrograms;