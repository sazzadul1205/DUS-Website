// resources/js/Pages/Frontend/About/About.jsx

// Inertia
import { Head } from "@inertiajs/react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Sections
import LegalSection from "./LegalSection/LegalSection";
import CardsSection from "./CardsSection/CardsSection";
import BannerSection from "./BannerSection/BannerSection";
import HeroFigureSection from "./HeroFigureSection/HeroFigureSection";
import FAQSection from "./FAQSection/FAQSection";

const About = ({
  topBarData,
  navbarData,
  footerData,
  bannerData,
  visionAndMissionData,
  backgroundData,
  legalData,
  interventionalData,
  evolutionaryChangesData,
  governanceData,
  cardsData,
  programsData,
  trainingData,
  faqData,
}) => {

  return (
    <PublicLayout topBarData={topBarData} navbarData={navbarData} footerData={footerData} >
      <Head title="DUS - Dwip Unnayan Society | Empowering Communities" />

      <BannerSection bannerData={bannerData} />

      <HeroFigureSection
        layout="text-left"
        data={backgroundData}
        sectionId="background"
      />

      <HeroFigureSection
        layout="text-right"
        data={visionAndMissionData}
        sectionId="vision-and-mission"
        bgColor="bg-[#F5F5F5]"
      />

      <HeroFigureSection
        layout="text-left"
        data={interventionalData}
        sectionId="interventional-approaches"
      />

      <LegalSection legalData={legalData} />

      <HeroFigureSection
        layout="text-left"
        data={evolutionaryChangesData}
        sectionId="evolutionary-changes"
      />

      <HeroFigureSection
        layout="text-right"
        data={governanceData}
        sectionId="governance"
        bgColor="bg-[#F5F5F5]"
      />

      <CardsSection cardsData={cardsData} />

      <HeroFigureSection
        layout="text-right"
        data={programsData}
        sectionId="programs-activities"
        bgColor="bg-[#F5F5F5]"
      />

      <HeroFigureSection
        layout="text-left"
        data={trainingData}
        sectionId="training"
      />

      <FAQSection faqData={faqData} />
    </PublicLayout >
  );
};

export default About;