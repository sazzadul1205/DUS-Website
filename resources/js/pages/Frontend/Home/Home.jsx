// resources/js/Pages/Frontend/Home/Home.jsx

// Inertia
import { Head } from "@inertiajs/react";


// Components
import PublicLayout from "../../../layouts/PublicLayout";

// Sections
import JobsSection from "./JobsSection/JobsSection";
import BannerSection from "./BannerSection/BannerSection";
import StoriesSection from "./StoriesSection/StoriesSection";
import AboutUsSection from "./AboutUsSection/AboutUsSection";
import OurActionSection from "./OurActionSection/OurActionSection";
import WhereWeWorkSection from "./WhereWeWorkSection/WhereWeWorkSection";
import OurProgramsSection from "./OurProgramsSection/OurProgramsSection";
import ProgramImpactSection from "./ProgramImpactSection/ProgramImpactSection";
import UpcomingEventsSection from "./UpcomingEventsSection/UpcomingEventsSection";

// resources/js/Pages/Frontend/Home.jsx
export default function Home({
  bannerData,
  aboutUsData,
  ourActionData,
  whereWeWorkData,
  ourProgramsData,
  storiesData,
  upcomingEventsData,
  jobsData,
  programImpactData,
  topBarData,
  navbarData,
  footerData
}) {
  // No need to define data here anymore - it comes from controller!

  return (
    <PublicLayout topBarData={topBarData} navbarData={navbarData} footerData={footerData}>
      <Head title="DUS - Dwip Unnayan Society | Empowering Communities" />

      <BannerSection bannerData={bannerData} />
      <AboutUsSection aboutUsData={aboutUsData} />
      <OurActionSection actionData={ourActionData} />
      <WhereWeWorkSection workData={whereWeWorkData} />
      <OurProgramsSection programsData={ourProgramsData} />
      <StoriesSection storiesData={storiesData} />
      <UpcomingEventsSection eventsData={upcomingEventsData} />
      <JobsSection jobsData={jobsData} />
      <ProgramImpactSection impactData={programImpactData} />
    </PublicLayout>
  );
}