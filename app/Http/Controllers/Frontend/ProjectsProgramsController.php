<?php
// app/Http/Controllers/Frontend/ProjectsProgramsController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsProgramsController extends Controller
{
  use SharedDataTrait;

  /**
   * Display the projects & programs page
   */
  public function projectsPrograms(): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Banner Data for sub-page
    $bannerData = [
      'background' => [
        'src' => 'https://placehold.co/1920x589',
        'alt' => 'Background'
      ],
      'overlay' => [
        'darkOverlay' => 'bg-black/40 lg:bg-black/50',
        'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
      ],
      'content' => [
        'title' => [
          'text' => 'Meet Our Charity Projects',
          'className' => 'font-bold leading-tight'
        ],
      ],
    ];

    // Our Programs Data for listing page (using excerpt from full content)
    $ourProgramsData = $this->getOurProgramsData($asset);

    // FAQ Data
    $faqData = $this->getFaqData();

    return Inertia::render('Frontend/ProjectsAndPrograms/ProjectsAndPrograms', array_merge(
      $this->getSharedData(),
      [
        'sectionConfig' => $this->getProjectsProgramsSectionConfig(),
        'faqData' => $faqData,
        'bannerData' => $bannerData,
        'ourProgramsData' => $ourProgramsData,
      ]
    ));
  }

  /**
   * Display projects & programs details-page dynamically based on slug
   */
  public function projectsProgramsDetails(string $slug): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Get all programs data from single source
    $allProgramsData = $this->getAllProgramsData($asset);

    // Check if the slug exists
    if (!isset($allProgramsData[$slug])) {
      abort(404, 'Program not found');
    }

    $programData = $allProgramsData[$slug];

    // Banner Data for sub-page
    $bannerData = [
      'background' => [
        'src' => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'),
        'alt' => 'Background'
      ],
      'overlay' => [
        'darkOverlay' => 'bg-black/40 lg:bg-black/50',
        'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
      ],
      'content' => [
        'title' => [
          'text' => $programData['title'],
          'className' => 'font-bold leading-tight'
        ],
      ],
    ];

    // FAQ Data
    $faqData = $this->getFaqData();

    // Upcoming Events Data
    $upcomingEventsData = $this->getUpcomingEventsData($asset);

    return Inertia::render('Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails', array_merge(
      $this->getSharedData(),
      [
        'sectionConfig' => $this->getProjectsProgramsDetailsSectionConfig($slug),
        'slug' => $slug,
        'faqData' => $faqData,
        'bannerData' => $bannerData,
        'programData' => $programData,
        'upcomingEventsData' => $upcomingEventsData,
      ]
    ));
  }

  /**
   * Get Projects & Programs page section configuration
   */
  private function getProjectsProgramsSectionConfig(): array
  {
    return [
      'sections' => [
        [
          'id' => 'banner',
          'component' => 'PageBannerSection',
          'enabled' => true,
          'propName' => 'bannerData',
          'dataKey' => 'bannerData',
          'order' => 1,
          'customProps' => ['sectionId' => 'projects-programs-banner']
        ],
        [
          'id' => 'our-programs',
          'component' => 'OurProgramsSection',
          'enabled' => true,
          'propName' => 'programsData',
          'dataKey' => 'ourProgramsData',
          'order' => 2,
          'customProps' => []
        ],
        [
          'id' => 'faq',
          'component' => 'FAQSection',
          'enabled' => true,
          'propName' => 'faqData',
          'dataKey' => 'faqData',
          'order' => 3,
          'customProps' => []
        ],
      ],
    ];
  }

  /**
   * Get Projects & Programs Details page section configuration
   */
  private function getProjectsProgramsDetailsSectionConfig(string $slug): array
  {
    return [
      'sections' => [
        [
          'id' => 'banner',
          'component' => 'PageBannerSection',
          'enabled' => true,
          'propName' => 'bannerData',
          'dataKey' => 'bannerData',
          'order' => 1,
          'customProps' => ['sectionId' => "program-{$slug}-banner"]
        ],
        [
          'id' => 'program-content',
          'component' => 'ProgramContentSection',
          'isSpecialComponent' => true,
          'enabled' => true,
          'order' => 2,
          'customProps' => [
            'bgColor' => 'bg-white',
            'paddingY' => 'py-37.5',
            'paddingX' => 'px-100'
          ]
        ],
        [
          'id' => 'faq',
          'component' => 'FAQSection',
          'enabled' => true,
          'propName' => 'faqData',
          'dataKey' => 'faqData',
          'order' => 3,
          'customProps' => []
        ],
        [
          'id' => 'upcoming-events',
          'component' => 'UpcomingEventsSection',
          'enabled' => true,
          'propName' => 'eventsData',
          'dataKey' => 'upcomingEventsData',
          'order' => 4,
          'customProps' => []
        ],
      ],
    ];
  }

  /**
   * Get all programs data - SINGLE SOURCE OF TRUTH
   * This contains the full data for each program
   */
  private function getAllProgramsData($asset): array
  {
    return [
      'micro-finance' => [
        'title' => 'Micro-Finance Program',
        'breadcrumb' => 'Micro-Finance Program',
        'image' => $asset('OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp'),
        'bgColor' => 'bg-[#E6F3E7]',
        'link' => '/projects-programs/micro-finance',
        'excerpt' => $this->getMicroFinanceExcerpt(),
        'fullContent' => $this->getMicroFinanceFullContent()
      ],
      'climate-change' => [
        'title' => 'Climate Change and Disaster Management Program',
        'breadcrumb' => 'Climate Change & Disaster Management',
        'image' => $asset('OurPrograms/a03fa6dba9fcdac0a5aedf2d337b118228a03298.webp'),
        'bgColor' => 'bg-[#F3EDE6]',
        'link' => '/projects-programs/climate-change',
        'excerpt' => $this->getClimateChangeExcerpt(),
        'fullContent' => $this->getClimateChangeFullContent()
      ],
      'community-radio' => [
        'title' => 'Community Radio Program',
        'breadcrumb' => 'Community Radio',
        'image' => $asset('OurPrograms/e280b627b1771904c38022aac2566b932e248887.webp'),
        'bgColor' => 'bg-[#E8E6F3]',
        'link' => '/projects-programs/community-radio',
        'excerpt' => $this->getCommunityRadioExcerpt(),
        'fullContent' => $this->getCommunityRadioFullContent()
      ],
      'dwip-education' => [
        'title' => 'DWIP Education Program',
        'breadcrumb' => 'Education Program',
        'image' => $asset('OurPrograms/42ccde89743ee9405c6546567e02dfbb36759866.jpg'),
        'bgColor' => 'bg-[#EEF3E6]',
        'link' => '/projects-programs/dwip-education',
        'excerpt' => $this->getEducationExcerpt(),
        'fullContent' => $this->getEducationFullContent()
      ],
      'information-and-communication-technology' => [
        'title' => 'Information and Communication Technology (ICT)',
        'breadcrumb' => 'ICT Program',
        'image' => $asset('OurPrograms/41146cd8c06fe1e0af97901abf7120a065421b19.jpg'),
        'bgColor' => 'bg-[#E6F3F1]',
        'link' => '/projects-programs/information-and-communication-technology',
        'excerpt' => $this->getICTExcerpt(),
        'fullContent' => $this->getICTFullContent()
      ],
      'research-and-documentation' => [
        'title' => 'Research and Documentation',
        'breadcrumb' => 'Research & Documentation',
        'image' => $asset('OurPrograms/a496922a3fc00992b6c454822d60bde51dc001e5.webp'),
        'bgColor' => 'bg-[#F3E6EA]',
        'link' => '/projects-programs/research-and-documentation',
        'excerpt' => $this->getResearchExcerpt(),
        'fullContent' => $this->getResearchFullContent()
      ],
      'livelihood-restoration-project' => [
        'title' => 'Livelihood Restoration Project',
        'breadcrumb' => 'Livelihood Restoration',
        'image' => $asset('OurPrograms/1b7d77f85b29f0b12d98e2a09ddc1d734c6f6ea1.jpg'),
        'bgColor' => 'bg-[#E6ECF3]',
        'link' => '/projects-programs/livelihood-restoration-project',
        'excerpt' => $this->getLivelihoodExcerpt(),
        'fullContent' => $this->getLivelihoodFullContent()
      ],
      'group-member-insurance-savings-scheme' => [
        'title' => 'Group Member Insurance & Savings Scheme',
        'breadcrumb' => 'Insurance & Savings Scheme',
        'image' => $asset('OurPrograms/21f2ed036293018aac5b8d98c97bc26201e92f68.jpg'),
        'bgColor' => 'bg-[#F3E6F1]',
        'link' => '/projects-programs/group-member-insurance-savings-scheme',
        'excerpt' => $this->getInsuranceExcerpt(),
        'fullContent' => $this->getInsuranceFullContent()
      ],
      'social-development-program' => [
        'title' => 'Social Development Program',
        'breadcrumb' => 'Social Development',
        'image' => $asset('OurPrograms/a00b43d1f3ee0f568f2e058ee39101be8911c1a0.jpg'),
        'bgColor' => 'bg-[#F3E6EA]',
        'link' => '/projects-programs/social-development-program',
        'excerpt' => $this->getSocialDevelopmentExcerpt(),
        'fullContent' => $this->getSocialDevelopmentFullContent()
      ],
      'legal-and-human-rights' => [
        'title' => 'Legal and Human Rights',
        'breadcrumb' => 'Legal & Human Rights',
        'image' => $asset('OurPrograms/1c54b2045a0958af86f3c81624c73f0b8e23b6f7.jpg'),
        'bgColor' => 'bg-[#E6F1F3]',
        'link' => '/projects-programs/legal-and-human-rights',
        'excerpt' => $this->getLegalExcerpt(),
        'fullContent' => $this->getLegalFullContent()
      ],
      'watsan-program' => [
        'title' => 'WATSAN Program',
        'breadcrumb' => 'Water & Sanitation',
        'image' => $asset('OurPrograms/42d5b669fc99984337547c6028cb9251bc1b306d.jpg'),
        'bgColor' => 'bg-[#F2F3E6]',
        'link' => '/projects-programs/watsan-program',
        'excerpt' => $this->getWatsanExcerpt(),
        'fullContent' => $this->getWatsanFullContent()
      ],
      'training-and-other-facilities' => [
        'title' => 'Training and Other Facilities',
        'breadcrumb' => 'Training Facilities',
        'image' => $asset('OurPrograms/be14c45848898048e7b7832affc4dc713b032e10.webp'),
        'bgColor' => 'bg-[#E6EDF3]',
        'link' => '/projects-programs/training-and-other-facilities',
        'excerpt' => $this->getTrainingExcerpt(),
        'fullContent' => $this->getTrainingFullContent()
      ],
      'tourism-and-hospitality' => [
        'title' => 'Tourism and Hospitality',
        'breadcrumb' => 'Tourism & Hospitality',
        'image' => $asset('OurPrograms/83260e25460beb43cd8a9c084bb311328e8f24d7.jpg'),
        'bgColor' => 'bg-[#EAE6F3]',
        'link' => '/projects-programs/tourism-and-hospitality',
        'excerpt' => $this->getTourismExcerpt(),
        'fullContent' => $this->getTourismFullContent()
      ],
    ];
  }

  /**
   * Get Our Programs Data for the listing page (using excerpts)
   */
  private function getOurProgramsData($asset): array
  {
    $allPrograms = $this->getAllProgramsData($asset);
    $programs = [];

    foreach ($allPrograms as $slug => $program) {
      $programs[] = [
        'id' => $this->getProgramIdBySlug($slug),
        'title' => $program['title'],
        'description' => $program['excerpt'],
        'image' => $program['image'],
        'bgColor' => $program['bgColor'],
        'link' => $program['link'],
      ];
    }

    return ['programs' => $programs];
  }

  /**
   * Helper to get program ID by slug
   */
  private function getProgramIdBySlug(string $slug): int
  {
    $ids = [
      'micro-finance' => 1,
      'climate-change' => 2,
      'community-radio' => 3,
      'dwip-education' => 4,
      'information-and-communication-technology' => 5,
      'research-and-documentation' => 6,
      'livelihood-restoration-project' => 7,
      'group-member-insurance-savings-scheme' => 8,
      'social-development-program' => 9,
      'legal-and-human-rights' => 10,
      'watsan-program' => 11,
      'training-and-other-facilities' => 12,
      'tourism-and-hospitality' => 13,
    ];

    return $ids[$slug] ?? 0;
  }


  // ==================== EXCERPT METHODS (for listing page) ====================

  private function getMicroFinanceExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p>
            
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Key Achievements:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">40,000+ active group members</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">97% female beneficiaries</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Over 95% loan recovery rate</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Operating in 50+ villages</li>
                </ul>
            </div>
        </div>';
  }

  private function getClimateChangeExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS is geographically located at very exposed disaster risk area of Coastal Bangladesh, most of its beneficiaries as well as core staffs of the organization and volunteers including general members are experienced by the influence of topography & living experience with the community, to cope with and face any natural disaster.</p>
            
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS is now moving beyond relief and rehabilitation into <strong class="text-[#009BE2]">institutionalized preparedness, risk reduction and management interventions</strong> as well as long term adaptation strategies.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Program Components:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Early warning systems and community preparedness</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Cyclone shelter management and maintenance</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Climate-resilient agriculture practices</li>
                </ul>
            </div>
        </div>';
  }

  private function getCommunityRadioExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Strengthening Hatiya Island community for pioneering-connecting and empowering their Voice for Change. Bangladesh is the <strong class="text-[#009BE2]">2nd country in South Asia</strong> in formulating policy for Community Radio.</p>
            
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The community radio serves as a platform for disseminating agricultural information, health awareness, local news, and women empowerment programs.</p>
        </div>';
  }

  private function getEducationExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Education is the most powerful tool to break the cycle of poverty. DUS\'s Education Program focuses on providing <strong class="text-[#009BE2]">quality education to underprivileged children</strong> in coastal communities.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Key Interventions:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Scholarship programs for 500+ students annually</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">School infrastructure development</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Teacher training and capacity building</li>
                </ul>
            </div>
        </div>';
  }

  private function getICTExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Bridging the digital divide in coastal communities through <strong class="text-[#009BE2]">ICT for Development (ICT4D)</strong> initiatives.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Program Highlights:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">15 community ICT centers established</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Digital literacy training for 5,000+ women</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Mobile banking and digital payment solutions</li>
                </ul>
            </div>
        </div>';
  }

  private function getResearchExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> to conduct quality research in diverse areas of human and social development sectors.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Research Areas:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Baseline surveys and needs assessments</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Impact evaluation studies</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Documentation of best practices</li>
                </ul>
            </div>
        </div>';
  }

  private function getLivelihoodExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">This project focuses on restoring and enhancing livelihood opportunities for communities affected by natural disasters and economic vulnerabilities.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Livelihood Options:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Small business development</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Agricultural diversification</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Livestock and poultry farming</li>
                </ul>
            </div>
        </div>';
  }

  private function getInsuranceExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">A comprehensive social protection mechanism for our group members, combining <strong class="text-[#009BE2]">savings and insurance</strong> to provide financial security and risk coverage.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Benefits:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Life insurance coverage up to BDT 50,000</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Health and accident benefits</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Emergency loan facilities</li>
                </ul>
            </div>
        </div>';
  }

  private function getSocialDevelopmentExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Addressing social issues and promoting inclusive development through community mobilization and awareness programs.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Focus Areas:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Women empowerment and leadership</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Child rights and protection</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Disability-inclusive development</li>
                </ul>
            </div>
        </div>';
  }

  private function getLegalExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Promoting <strong class="text-[#009BE2]">access to justice and human rights protection</strong> for marginalized communities through legal aid, awareness, and advocacy.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Services:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Free legal aid and counseling</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Human rights awareness campaigns</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Land rights and property dispute resolution</li>
                </ul>
            </div>
        </div>';
  }

  private function getWatsanExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Building on its long experience of providing water and sanitation services to communities, DUS started its <strong class="text-[#009BE2]">Water and Sanitation program</strong> with the support of the Netherland Govt.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Targets:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">4,605 households with sanitation access</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">250 deep tube wells for safe water</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">20,000 people with hygiene education</li>
                </ul>
            </div>
        </div>';
  }

  private function getTrainingExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS has developed a comprehensive <strong class="text-[#009BE2]">Training and Communication Unit</strong> fully equipped with all possible physical and human resources to deliver high-quality capacity building programs.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Training Offerings:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Skill development and vocational training</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Leadership and management training</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">ToT (Training of Trainers) programs</li>
                </ul>
            </div>
        </div>';
  }

  private function getTourismExcerpt(): string
  {
    return '
        <div class="space-y-4">
            <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Promoting <strong class="text-[#009BE2]">sustainable tourism and hospitality</strong> as an emerging livelihood opportunity for coastal communities.</p>
            
            <div class="bg-white/50 rounded-lg p-4 mt-4">
                <h4 class="font-600 text-[18px] sm:text-[20px] text-[#080C14] mb-2">Initiatives:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Homestay and community guesthouse development</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Tour guide training and certification</li>
                    <li class="text-[14px] sm:text-[16px] text-[#524B48]">Eco-tourism awareness</li>
                </ul>
            </div>
        </div>';
  }

  // ==================== FULL CONTENT METHODS (for details page) ====================

  private function getMicroFinanceFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass root level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Achievements</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">40,000+ active group members</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">97% female beneficiaries</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Over 95% loan recovery rate</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Operating in 50+ villages</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">BDT 50+ crore distributed in loans</li>
                </ul>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Impact on Community</h2>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">The micro-finance program has significantly contributed to poverty reduction, women empowerment, and economic development in coastal communities. Many women have started their own businesses, improved their housing conditions, and are now able to send their children to school.</p>
            </div>
        </div>';
  }

  private function getClimateChangeFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS is geographically located at very exposed disaster risk area of Coastal Bangladesh, most of its beneficiaries as well as core staffs of the organization and volunteers including general members are experienced by the influence of topography & living experience with the community, to cope with and face any natural disaster.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Further during its lifetime DUS was active in major emergency in relief and rehabilitation programs following Nov. 1970 cyclone relief, 1988/1991-cyclone recovery, 1998 flood response, SIDR 2007 etc.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS is now moving beyond relief and rehabilitation into <strong class="text-[#009BE2]">institutionalized preparedness, risk reduction and management interventions</strong> as well as long term adaptation strategies as consequence of lessons learnt while helping communities cope with the devastating effects of Cyclone SIDR, which struck in November 2007.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Program Components</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Early warning systems and community preparedness</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Cyclone shelter management and maintenance</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Climate-resilient agriculture practices</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Post-disaster livelihood restoration</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Coastal afforestation and mangrove protection</li>
                </ul>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Our Response History</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">1970 Cyclone Relief</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">1988 Flood Response</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">1991 Cyclone Recovery</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">1998 Flood Response</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">2007 Cyclone SIDR Response</li>
                </ul>
            </div>
        </div>';
  }

  private function getCommunityRadioFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Strengthening Hatiya Island community for pioneering-connecting and empowering their Voice for Change. Bangladesh Government has already acknowledged the importance of community radio and announced the Community Radio Installation, Broadcast & Operation Policy.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Bangladesh is the <strong class="text-[#009BE2]">2nd country in South Asia</strong> in formulating policy for Community Radio. This initiative gives voice to the voiceless and empowers local communities to share their stories, concerns, and aspirations.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Broadcast Content</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Agricultural information and weather updates</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Health awareness and educational programs</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Local news and community announcements</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Women empowerment and youth engagement shows</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Cultural preservation and local talent promotion</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Disaster preparedness and emergency broadcasts</li>
                </ul>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Community Impact</h2>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">The community radio has become a vital source of information and entertainment for thousands of island residents. It has empowered local voices, preserved cultural heritage, and provided critical information during emergencies.</p>
            </div>
        </div>';
  }

  private function getEducationFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Education is the most powerful tool to break the cycle of poverty. DUS\'s Education Program focuses on providing <strong class="text-[#009BE2]">quality education to underprivileged children</strong> in coastal communities.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The program includes formal education support, non-formal primary education for out-of-school children, scholarships for meritorious students, and adult literacy classes for women.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Interventions</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Scholarship programs for 500+ students annually</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">School infrastructure development in remote areas</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Teacher training and capacity building</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Distribution of educational materials and supplies</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital learning centers for rural students</li>
                </ul>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Impact</h2>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Over 10,000 children have benefited from our education programs, with an 85% retention rate and significant improvement in learning outcomes. Many scholarship recipients have gone on to higher education and successful careers.</p>
            </div>
        </div>';
  }

  private function getICTFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Bridging the digital divide in coastal communities through <strong class="text-[#009BE2]">ICT for Development (ICT4D)</strong> initiatives. This program aims to empower communities with digital literacy and access to technology.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We establish community ICT centers, provide computer training, and facilitate access to online resources, government services, and digital financial inclusion.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Program Highlights</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">15 community ICT centers established</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital literacy training for 5,000+ women</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Mobile banking and digital payment solutions</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Online skill development courses</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Telemedicine and e-health services</li>
                </ul>
            </div>
        </div>';
  }

  private function getResearchFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> to conduct quality research in diverse areas of human and social development sectors, covering most importantly education, health, livelihood development, environment, human rights and social justice.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The R&D cell works as a professional support services unit to fulfill the growing demand for generation and systematic analysis of information in connection with the increasing involvement of DUS in its development activities.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Thus it engages in survey and research activities addressing the in-house needs of the organization for exploring and examining the feasible approaches for development, planning, designing, piloting, assessing and improving the implementation and performance of a wide range of projects.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Research Areas</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Baseline surveys and needs assessments</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Impact evaluation studies</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Action research on poverty reduction</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Documentation of best practices and case studies</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Policy briefs and advocacy materials</li>
                </ul>
            </div>
        </div>';
  }

  private function getLivelihoodFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">This project focuses on restoring and enhancing livelihood opportunities for communities affected by natural disasters and economic vulnerabilities.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We provide <strong class="text-[#009BE2]">vocational training, asset transfer, and enterprise development support</strong> to help families rebuild their lives and achieve sustainable income sources.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Livelihood Options</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Small business development and entrepreneurship</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Agricultural diversification and improved farming</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Livestock rearing and poultry farming</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Fisheries and aquaculture development</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Handicrafts and small-scale manufacturing</li>
                </ul>
            </div>
        </div>';
  }

  private function getInsuranceFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">A comprehensive social protection mechanism for our group members, combining <strong class="text-[#009BE2]">savings and insurance</strong> to provide financial security and risk coverage.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The scheme encourages regular savings habits while providing life insurance coverage, health benefits, and emergency support for member families during crises.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Benefits</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Life insurance coverage up to BDT 50,000</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Health and accident benefits</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Emergency loan facilities from savings</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Children\'s education support</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Old age security and retirement benefits</li>
                </ul>
            </div>
        </div>';
  }

  private function getSocialDevelopmentFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Addressing social issues and promoting inclusive development through community mobilization and awareness programs.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The program focuses on <strong class="text-[#009BE2]">social justice, gender equality, child protection, and community empowerment</strong> to create a more equitable society.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Focus Areas</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Women empowerment and leadership development</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Child rights and protection committees</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Prevention of child marriage and dowry</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Community-led social audits and accountability</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Disability-inclusive development initiatives</li>
                </ul>
            </div>
        </div>';
  }

  private function getLegalFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Promoting <strong class="text-[#009BE2]">access to justice and human rights protection</strong> for marginalized communities through legal aid, awareness, and advocacy.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We provide free legal counseling, support for victims of human rights violations, and conduct workshops on legal rights and entitlements.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Services</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Free legal aid and counseling clinics</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Human rights awareness campaigns</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Support for victims of violence and discrimination</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Land rights and property dispute resolution</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Paralegal training for community volunteers</li>
                </ul>
            </div>
        </div>';
  }

  private function getWatsanFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Building on its long experience of providing water and sanitation services to communities, DUS started its <strong class="text-[#009BE2]">Water and Sanitation program</strong> with the financial and technical support of the Netherland Government.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The program is implementing in Nangolia Char and Nalerchar under Hatiya Upazilla. Our goal is to provide sustainable and integrated WATSAN services in the rural areas.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We break the contamination cycle of unsanitary latrines, contaminated water and unsafe hygiene practices, as well as ensure sustainability and scaling-up of WATSAN services.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Targets</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">4,605 households with sanitation access</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">250 deep tube wells for safe water</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">20,000 people with hygiene education</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Community-led total sanitation approaches</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">School WASH facilities and hygiene promotion</li>
                </ul>
            </div>
        </div>';
  }

  private function getTrainingFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS has developed a comprehensive <strong class="text-[#009BE2]">Training and Communication Unit</strong> fully equipped with all possible physical and human resources to deliver high-quality capacity building programs.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We offer need-based training programs, develop modules and curriculum, and utilize modern training methodologies including participatory approaches, audio-visual aids, and practical demonstrations.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Training Offerings</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Skill development and vocational training</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Leadership and management training</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Financial literacy and business management</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">ToT (Training of Trainers) programs</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">MIS and data management training</li>
                </ul>
            </div>
        </div>';
  }

  private function getTourismFullContent(): string
  {
    return '
        <div class="space-y-6">
            <div>
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Promoting <strong class="text-[#009BE2]">sustainable tourism and hospitality</strong> as an emerging livelihood opportunity for coastal communities, leveraging the natural beauty and cultural heritage of Hatiya Island.</p>
                
                <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">This initiative focuses on developing community-based tourism, eco-tourism, and hospitality services that create employment while preserving local culture and environment.</p>
                
                <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Initiatives</h2>
                <ul class="list-disc pl-6 space-y-3">
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Homestay and community guesthouse development</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Tour guide training and certification</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Handicraft and souvenir production</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Local cuisine and food service training</li>
                    <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Eco-tourism and nature conservation awareness</li>
                </ul>
            </div>
        </div>';
  }
}
