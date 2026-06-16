<?php
// app/Http/Controllers/Frontend/SharedDataTrait.php

namespace App\Http\Controllers\Frontend;

trait SharedDataTrait
{
  /**
   * Get shared data for all frontend pages (TopBar, Navbar, Footer)
   */
  public function getSharedData(): array
  {
    // Asset helper function using route
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Mock SQL Data Structure for Shared Components
    $mockSharedData = [
      // Table: top_bar_configs
      'top_bar_configs' => $this->getTopBarConfigs(),

      // Table: navbar_configs
      'navbar_configs' => $this->getNavbarConfigs(),

      // Table: footer_configs
      'footer_configs' => $this->getFooterConfigs(),

      // Table: upcoming_events_configs
      'upcoming_events_configs' => $this->getUpcomingEventsConfigs(),

      // Table: faq_configs
      'faq_configs' => $this->getFaqConfigs(),
    ];

    // Transform asset URLs and build response
    $transformedData = $this->transformAssetUrls($mockSharedData, $asset);

    return [
      'topBarData' => $transformedData['top_bar_configs']['data'],
      'navbarData' => $transformedData['navbar_configs']['data'],
      'footerData' => $transformedData['footer_configs']['data'],
    ];
  }

  /**
   * Transform asset placeholders in data
   */
  private function transformAssetUrls(array $data, callable $asset): array
  {
    $transformed = [];

    foreach ($data as $key => $value) {
      if (is_array($value)) {
        $transformed[$key] = $this->transformAssetUrls($value, $asset);
      } elseif (is_string($value) && str_starts_with($value, 'asset:')) {
        $path = substr($value, 6);
        $transformed[$key] = $asset($path);
      } else {
        $transformed[$key] = $value;
      }
    }

    return $transformed;
  }

  /**
   * Get Top Bar Configurations (Table: top_bar_configs)
   */
  private function getTopBarConfigs(): array
  {
    return [
      'id' => 1,
      'component' => 'TopBar',
      'enabled' => true,
      'page' => 'global',
      'data' => [
        'contactInfo' => [
          'email' => [
            'text' => 'dus.eddus@gmail.com',
            'icon' => 'asset:images/TopBar/Email.svg',
            'alt' => 'Email'
          ],
          'phone' => [
            'text' => '+880 1761-493412',
            'icon' => 'asset:images/TopBar/Phone.svg',
            'alt' => 'Phone'
          ],
          'hours' => [
            'text' => 'Sun - Thu 9:00AM - 5:00PM',
            'icon' => 'asset:images/TopBar/Clock.svg',
            'alt' => 'Clock'
          ]
        ],
        'languages' => [
          ['code' => 'us', 'name' => 'English', 'flag' => 'asset:images/Flags/united-states.png'],
          ['code' => 'bd', 'name' => 'Bengali', 'flag' => 'asset:images/Flags/bangladesh.png'],
        ],
        'socialLinks' => [
          ['id' => 1, 'name' => 'Facebook', 'url' => 'https://facebook.com', 'iconName' => 'FaFacebook', 'hoverColor' => 'hover:text-blue-400'],
          ['id' => 2, 'name' => 'Instagram', 'url' => 'https://instagram.com', 'iconName' => 'FaInstagram', 'hoverColor' => 'hover:text-pink-400'],
          ['id' => 3, 'name' => 'Twitter', 'url' => 'https://twitter.com', 'iconName' => 'FaXTwitter', 'hoverColor' => 'hover:text-gray-400'],
          ['id' => 4, 'name' => 'LinkedIn', 'url' => 'https://linkedin.com', 'iconName' => 'FaLinkedin', 'hoverColor' => 'hover:text-blue-500']
        ],
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Navbar Configurations (Table: navbar_configs)
   */
  private function getNavbarConfigs(): array
  {
    return [
      'id' => 1,
      'component' => 'Navbar',
      'enabled' => true,
      'page' => 'global',
      'data' => [
        'logo' => [
          'src' => 'asset:images/Icon.svg',
          'alt' => 'DUS Logo',
          'className' => 'h-17.5 w-auto',
          'href' => '/'
        ],
        'navLinks' => [
          ['name' => 'Home', 'href' => '/'],
          ['name' => 'About', 'href' => '/about'],
          ['name' => 'Projects & Programs', 'href' => '/projects-programs'],
          ['name' => 'Blogs', 'href' => '/blogs'],
          ['name' => 'Contact Us', 'href' => '/contact'],
        ],
        'button' => [
          'text' => 'Contact Us',
          'href' => '/contact',
          'className' => 'capitalize text-white bg-[#009BE2] hover:bg-[#009BE2]/80 px-6 py-2 rounded-lg transition-colors duration-200'
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Footer Configurations (Table: footer_configs)
   */
  private function getFooterConfigs(): array
  {
    return [
      'id' => 1,
      'component' => 'Footer',
      'enabled' => true,
      'page' => 'global',
      'data' => [
        'logo' => [
          'src' => 'asset:images/Icon-bottom.svg',
          'alt' => 'DUS Logo',
          'className' => 'h-41.25 w-auto'
        ],
        'description' => 'A Community based philanthropic and development organization emergence/dedicated to sustainable poverty reduction, entrepreneur\'s promotion and capacity building of the underprivileged directing towards a just society',
        'socialLinks' => [
          ['iconName' => 'FaFacebook', 'url' => '#', 'hoverColor' => 'hover:text-blue-400', 'ariaLabel' => 'Facebook'],
          ['iconName' => 'FaInstagram', 'url' => '#', 'hoverColor' => 'hover:text-pink-400', 'ariaLabel' => 'Instagram'],
          ['iconName' => 'FaXTwitter', 'url' => '#', 'hoverColor' => 'hover:text-gray-400', 'ariaLabel' => 'Twitter'],
          ['iconName' => 'FaLinkedin', 'url' => '#', 'hoverColor' => 'hover:text-blue-500', 'ariaLabel' => 'LinkedIn']
        ],
        'address' => [
          'title' => 'Address',
          'details' => '24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka - 1207',
        ],
        'contact' => [
          'title' => 'Call',
          'numbers' => [
            '+88 01761 493407',
            '+88 01622 093793 – (In Emergency)',
            '+88 02 48110362'
          ]
        ],
        'email' => [
          'title' => 'Email Us',
          'addresses' => [
            'dusdhaka@gmail.com',
            'dus.eddus@gmail.com'
          ]
        ],
        'quickLinks' => [
          ['name' => 'About Us', 'url' => '/about-us'],
          ['name' => 'Community Radio', 'url' => '/community-radio'],
          ['name' => 'Evaluation', 'url' => '/evaluation'],
          ['name' => 'Working Area', 'url' => '/working-area'],
          ['name' => 'Publication', 'url' => '/publication'],
          ['name' => 'Mission & Visions', 'url' => '/mission-visions'],
          ['name' => 'Blogs', 'url' => '/blogs'],
          ['name' => 'Contact Us', 'url' => '/contact-us']
        ],
        'programs' => [
          ['name' => 'Micro-Finance Program', 'url' => '/programs/micro-finance'],
          ['name' => 'Disaster Management', 'url' => '/programs/disaster-management'],
          ['name' => 'Community Radio', 'url' => '/programs/community-radio'],
          ['name' => 'Education', 'url' => '/programs/education'],
          ['name' => 'ICT for Development', 'url' => '/programs/ict-development'],
          ['name' => 'Health Program', 'url' => '/programs/health'],
          ['name' => 'Livelihood', 'url' => '/programs/livelihood'],
          ['name' => 'Member Facilities', 'url' => '/programs/member-facilities'],
          ['name' => 'Social Development', 'url' => '/programs/social-development'],
          ['name' => 'Legal Support', 'url' => '/programs/legal-support'],
          ['name' => 'Agriculture', 'url' => '/programs/agriculture'],
          ['name' => 'Water and Sanitation', 'url' => '/programs/water-sanitation'],
          ['name' => 'Research and Documentation', 'url' => '/programs/research-documentation'],
          ['name' => 'Training Facilities', 'url' => '/programs/training'],
          ['name' => 'Tourism', 'url' => '/programs/tourism']
        ],
        'newsletter' => [
          'title' => 'Subscribe to Our Newsletter',
          'placeholder' => 'Enter your email address',
          'buttonText' => 'Subscribe',
          'apiEndpoint' => '/api/subscribe-newsletter'
        ],
        'bottomFooter' => [
          'copyright' => '© 2026 Dwip Unnayan. All rights reserved.',
          'links' => [
            ['text' => 'Terms of Service', 'url' => '/terms'],
            ['text' => 'Privacy Policy', 'url' => '/privacy']
          ]
        ],
        'quickLinkLinkIcon' => 'asset:images/link.svg',
        'OurProgramLinkIcon' => 'asset:images/link.svg',
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Upcoming Events Configurations (Table: upcoming_events_configs)
   */
  public function getUpcomingEventsConfigs(): array
  {
    return [
      'id' => 1,
      'component' => 'UpcomingEventsSection',
      'enabled' => true,
      'page' => 'home',
      'data' => [
        'section' => [
          'title' => 'Upcoming Events & Community Actions',
          'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.',
          'button' => [
            'text' => 'Explore All Events',
            'link' => '/events'
          ]
        ],
        'image' => [
          'src' => 'asset:UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp',
          'alt' => 'Events Image',
          'className' => 'mt-15 rounded-2xl h-139.25 w-auto'
        ],
        'events' => [
          [
            'id' => 1,
            'date' => [
              'day' => '25',
              'month' => 'Apr',
              'weekday' => 'THU',
              'dayNumber' => '1',
              'time' => '10:30AM'
            ],
            'location' => 'International Convention City Bashundhara - ICCB',
            'title' => 'Participate in our community clean-up day and make a difference together',
            'description' => 'Let\'s shape the future of the food industry together! Participate at the 9th Food Bangladesh Int\'l Expo 2026,',
            'link' => '/events/community-cleanup'
          ],
          [
            'id' => 2,
            'date' => [
              'day' => '28',
              'month' => 'Apr',
              'weekday' => 'SUN',
              'dayNumber' => '2',
              'time' => '02:00PM'
            ],
            'location' => 'Dhaka University Campus - Dhaka',
            'title' => 'Education for All: Scholarship Distribution Ceremony',
            'description' => 'Join us as we distribute scholarships to underprivileged students and celebrate their achievements in pursuing quality education.',
            'link' => '/events/scholarship-ceremony'
          ],
          [
            'id' => 3,
            'date' => [
              'day' => '05',
              'month' => 'May',
              'weekday' => 'MON',
              'dayNumber' => '3',
              'time' => '09:00AM'
            ],
            'location' => 'Hatiya Island Community Center - Noakhali',
            'title' => 'Climate Adaptation Workshop for Coastal Communities',
            'description' => 'Learn sustainable farming techniques and disaster preparedness strategies to combat climate change impacts in coastal areas.',
            'link' => '/events/climate-workshop'
          ]
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get FAQ Configurations (Table: faq_configs)
   */
  public function getFaqConfigs(): array
  {
    return [
      'id' => 1,
      'component' => 'FaqSection',
      'enabled' => true,
      'page' => 'projects-programs',
      'data' => [
        'section' => [
          'title' => 'Key Questions Answered About Our Programs',
          'subtitle' => 'Explore our Frequently Asked Questions for answers about our charity\'s projects, programs, and how you can get involved.'
        ],
        'faqs' => [
          [
            'id' => 1,
            'question' => 'How can I participate in your programs?',
            'answer' => 'You can participate by becoming a volunteer, donor, or partner organization. Visit our "Get Involved" page or contact our office directly to learn about current opportunities.',
          ],
          [
            'id' => 2,
            'question' => 'Who is eligible for micro-finance support?',
            'answer' => 'Our micro-finance program primarily serves poor women, marginal farmers, and small micro-entrepreneurs in coastal communities. Priority is given to landless households and disaster-affected families.',
          ],
          [
            'id' => 3,
            'question' => 'How do you ensure program sustainability?',
            'answer' => 'We ensure sustainability through community ownership, capacity building, income generation mechanisms, and partnerships with local government and development organizations.',
          ],
          [
            'id' => 4,
            'question' => 'Can international donors support your programs?',
            'answer' => 'Yes, we welcome international support. DUS is registered with the NGO Affairs Bureau and can receive foreign donations. Contact us for partnership opportunities.',
          ],
          [
            'id' => 5,
            'question' => 'How do you measure program impact?',
            'answer' => 'We conduct regular monitoring, baseline and end-line surveys, impact assessments, and participatory evaluations involving community members to measure our program effectiveness.',
          ],
          [
            'id' => 6,
            'question' => 'What geographical areas do you cover?',
            'answer' => 'Our primary focus is Hatiya Island and surrounding coastal areas in Noakhali district, including Subarnachar, Companyganj, and Noakhali Sadar Upazilas.',
          ],
          [
            'id' => 7,
            'question' => 'How can I volunteer with DUS?',
            'answer' => 'You can apply through our website\'s volunteer section, attend our orientation sessions, or contact our HR department. We welcome both local and international volunteers.',
          ],
          [
            'id' => 8,
            'question' => 'Are your financial reports publicly available?',
            'answer' => 'Yes, we maintain transparency by publishing annual reports, audit statements, and financial summaries on our website and making them available to stakeholders upon request.',
          ]
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Helper method to get upcoming events data (maintains backward compatibility)
   */
  public function getUpcomingEventsData($asset): array
  {
    $config = $this->getUpcomingEventsConfigs();
    $data = $config['data'];

    // Transform asset URLs
    return $this->transformAssetUrls($data, $asset);
  }

  /**
   * Helper method to get FAQ data (maintains backward compatibility)
   */
  public function getFaqData(): array
  {
    $config = $this->getFaqConfigs();
    return $config['data'];
  }

  /**
   * All programs – full content only (no excerpts)
   */
  public function getAllProgramsData(callable $asset): array
  {
    return [
      'micro-finance' => [
        'id' => 1,
        'slug' => 'micro-finance',
        'title' => 'Micro-Finance Program',
        'breadcrumb' => 'Micro-Finance Program',
        'image' => $asset('OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp'),
        'bgColor' => '#E6F3E7',
        'link' => '/projects-programs/micro-finance',
        'fullContentHtml' => $this->getMicroFinanceFullContent(),
      ],
      'climate-change' => [
        'id' => 2,
        'slug' => 'climate-change',
        'title' => 'Climate Change and Disaster Management Program',
        'breadcrumb' => 'Climate Change & Disaster Management',
        'image' => $asset('OurPrograms/a03fa6dba9fcdac0a5aedf2d337b118228a03298.webp'),
        'bgColor' => '#F3EDE6',
        'link' => '/projects-programs/climate-change',
        'fullContentHtml' => $this->getClimateChangeFullContent(),
      ],
      'community-radio' => [
        'id' => 3,
        'slug' => 'community-radio',
        'title' => 'Community Radio Program',
        'breadcrumb' => 'Community Radio',
        'image' => $asset('OurPrograms/e280b627b1771904c38022aac2566b932e248887.webp'),
        'bgColor' => '#E8E6F3',
        'link' => '/projects-programs/community-radio',
        'fullContentHtml' => $this->getCommunityRadioFullContent(),
      ],
      'dwip-education' => [
        'id' => 4,
        'slug' => 'dwip-education',
        'title' => 'DWIP Education Program',
        'breadcrumb' => 'Education Program',
        'image' => $asset('OurPrograms/42ccde89743ee9405c6546567e02dfbb36759866.jpg'),
        'bgColor' => '#EEF3E6',
        'link' => '/projects-programs/dwip-education',
        'fullContentHtml' => $this->getEducationFullContent(),
      ],
      'information-and-communication-technology' => [
        'id' => 5,
        'slug' => 'information-and-communication-technology',
        'title' => 'Information and Communication Technology (ICT)',
        'breadcrumb' => 'ICT Program',
        'image' => $asset('OurPrograms/41146cd8c06fe1e0af97901abf7120a065421b19.jpg'),
        'bgColor' => '#E6F3F1',
        'link' => '/projects-programs/information-and-communication-technology',
        'fullContentHtml' => $this->getICTFullContent(),
      ],
      'research-and-documentation' => [
        'id' => 6,
        'slug' => 'research-and-documentation',
        'title' => 'Research and Documentation',
        'breadcrumb' => 'Research & Documentation',
        'image' => $asset('OurPrograms/a496922a3fc00992b6c454822d60bde51dc001e5.webp'),
        'bgColor' => '#F3E6EA',
        'link' => '/projects-programs/research-and-documentation',
        'fullContentHtml' => $this->getResearchFullContent(),
      ],
      'livelihood-restoration-project' => [
        'id' => 7,
        'slug' => 'livelihood-restoration-project',
        'title' => 'Livelihood Restoration Project',
        'breadcrumb' => 'Livelihood Restoration',
        'image' => $asset('OurPrograms/1b7d77f85b29f0b12d98e2a09ddc1d734c6f6ea1.jpg'),
        'bgColor' => '#E6ECF3',
        'link' => '/projects-programs/livelihood-restoration-project',
        'fullContentHtml' => $this->getLivelihoodFullContent(),
      ],
      'group-member-insurance-savings-scheme' => [
        'id' => 8,
        'slug' => 'group-member-insurance-savings-scheme',
        'title' => 'Group Member Insurance & Savings Scheme',
        'breadcrumb' => 'Insurance & Savings Scheme',
        'image' => $asset('OurPrograms/21f2ed036293018aac5b8d98c97bc26201e92f68.jpg'),
        'bgColor' => '#F3E6F1',
        'link' => '/projects-programs/group-member-insurance-savings-scheme',
        'fullContentHtml' => $this->getInsuranceFullContent(),
      ],
      'social-development-program' => [
        'id' => 9,
        'slug' => 'social-development-program',
        'title' => 'Social Development Program',
        'breadcrumb' => 'Social Development',
        'image' => $asset('OurPrograms/a00b43d1f3ee0f568f2e058ee39101be8911c1a0.jpg'),
        'bgColor' => '#F3E6EA',
        'link' => '/projects-programs/social-development-program',
        'fullContentHtml' => $this->getSocialDevelopmentFullContent(),
      ],
      'legal-and-human-rights' => [
        'id' => 10,
        'slug' => 'legal-and-human-rights',
        'title' => 'Legal and Human Rights',
        'breadcrumb' => 'Legal & Human Rights',
        'image' => $asset('OurPrograms/1c54b2045a0958af86f3c81624c73f0b8e23b6f7.jpg'),
        'bgColor' => '#E6F1F3',
        'link' => '/projects-programs/legal-and-human-rights',
        'fullContentHtml' => $this->getLegalFullContent(),
      ],
      'watsan-program' => [
        'id' => 11,
        'slug' => 'watsan-program',
        'title' => 'WATSAN Program',
        'breadcrumb' => 'Water & Sanitation',
        'image' => $asset('OurPrograms/42d5b669fc99984337547c6028cb9251bc1b306d.jpg'),
        'bgColor' => '#F2F3E6',
        'link' => '/projects-programs/watsan-program',
        'fullContentHtml' => $this->getWatsanFullContent(),
      ],
      'training-and-other-facilities' => [
        'id' => 12,
        'slug' => 'training-and-other-facilities',
        'title' => 'Training and Other Facilities',
        'breadcrumb' => 'Training Facilities',
        'image' => $asset('OurPrograms/be14c45848898048e7b7832affc4dc713b032e10.webp'),
        'bgColor' => '#E6EDF3',
        'link' => '/projects-programs/training-and-other-facilities',
        'fullContentHtml' => $this->getTrainingFullContent(),
      ],
      'tourism-and-hospitality' => [
        'id' => 13,
        'slug' => 'tourism-and-hospitality',
        'title' => 'Tourism and Hospitality',
        'breadcrumb' => 'Tourism & Hospitality',
        'image' => $asset('OurPrograms/83260e25460beb43cd8a9c084bb311328e8f24d7.jpg'),
        'bgColor' => '#EAE6F3',
        'link' => '/projects-programs/tourism-and-hospitality',
        'fullContentHtml' => $this->getTourismFullContent(),
      ],
    ];
  }

  private function getMicroFinanceFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass root level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Achievements</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">40,000+ active group members</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">97% female beneficiaries</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Over 95% loan recovery rate</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Operating in 50+ villages</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">BDT 50+ crore distributed in loans</li></ul><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Impact on Community</h2><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">The micro-finance program has significantly contributed to poverty reduction, women empowerment, and economic development in coastal communities. Many women have started their own businesses, improved their housing conditions, and are now able to send their children to school.</p></div></div>';
  }


  // The HTML For the Full Content
  private function getClimateChangeFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS is geographically located at very exposed disaster risk area of Coastal Bangladesh, most of its beneficiaries as well as core staffs of the organization and volunteers including general members are experienced by the influence of topography & living experience with the community, to cope with and face any natural disaster.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Further during its lifetime DUS was active in major emergency in relief and rehabilitation programs following Nov. 1970 cyclone relief, 1988/1991-cyclone recovery, 1998 flood response, SIDR 2007 etc.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS is now moving beyond relief and rehabilitation into <strong class="text-[#009BE2]">institutionalized preparedness, risk reduction and management interventions</strong> as well as long term adaptation strategies as consequence of lessons learnt while helping communities cope with the devastating effects of Cyclone SIDR, which struck in November 2007.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Program Components</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Early warning systems and community preparedness</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Cyclone shelter management and maintenance</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Climate-resilient agriculture practices</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Post-disaster livelihood restoration</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Coastal afforestation and mangrove protection</li></ul><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Our Response History</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">1970 Cyclone Relief</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">1988 Flood Response</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">1991 Cyclone Recovery</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">1998 Flood Response</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">2007 Cyclone SIDR Response</li></ul></div></div>';
  }

  private function getCommunityRadioFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Strengthening Hatiya Island community for pioneering-connecting and empowering their Voice for Change. Bangladesh Government has already acknowledged the importance of community radio and announced the Community Radio Installation, Broadcast & Operation Policy.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Bangladesh is the <strong class="text-[#009BE2]">2nd country in South Asia</strong> in formulating policy for Community Radio. This initiative gives voice to the voiceless and empowers local communities to share their stories, concerns, and aspirations.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Broadcast Content</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Agricultural information and weather updates</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Health awareness and educational programs</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Local news and community announcements</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Women empowerment and youth engagement shows</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Cultural preservation and local talent promotion</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Disaster preparedness and emergency broadcasts</li></ul><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Community Impact</h2><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">The community radio has become a vital source of information and entertainment for thousands of island residents. It has empowered local voices, preserved cultural heritage, and provided critical information during emergencies.</p></div></div>';
  }

  private function getEducationFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Education is the most powerful tool to break the cycle of poverty. DUS\'s Education Program focuses on providing <strong class="text-[#009BE2]">quality education to underprivileged children</strong> in coastal communities.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The program includes formal education support, non-formal primary education for out-of-school children, scholarships for meritorious students, and adult literacy classes for women.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Interventions</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Scholarship programs for 500+ students annually</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">School infrastructure development in remote areas</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Teacher training and capacity building</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Distribution of educational materials and supplies</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital learning centers for rural students</li></ul><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Impact</h2><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Over 10,000 children have benefited from our education programs, with an 85% retention rate and significant improvement in learning outcomes. Many scholarship recipients have gone on to higher education and successful careers.</p></div></div>';
  }

  private function getICTFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Bridging the digital divide in coastal communities through <strong class="text-[#009BE2]">ICT for Development (ICT4D)</strong> initiatives. This program aims to empower communities with digital literacy and access to technology.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We establish community ICT centers, provide computer training, and facilitate access to online resources, government services, and digital financial inclusion.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Program Highlights</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">15 community ICT centers established</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital literacy training for 5,000+ women</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Mobile banking and digital payment solutions</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Online skill development courses</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Telemedicine and e-health services</li></ul></div></div>';
  }

  private function getResearchFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> to conduct quality research in diverse areas of human and social development sectors, covering most importantly education, health, livelihood development, environment, human rights and social justice.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The R&D cell works as a professional support services unit to fulfill the growing demand for generation and systematic analysis of information in connection with the increasing involvement of DUS in its development activities.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Thus it engages in survey and research activities addressing the in-house needs of the organization for exploring and examining the feasible approaches for development, planning, designing, piloting, assessing and improving the implementation and performance of a wide range of projects.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Research Areas</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Baseline surveys and needs assessments</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Impact evaluation studies</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Action research on poverty reduction</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Documentation of best practices and case studies</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Policy briefs and advocacy materials</li></ul></div></div>';
  }

  private function getLivelihoodFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">This project focuses on restoring and enhancing livelihood opportunities for communities affected by natural disasters and economic vulnerabilities.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We provide <strong class="text-[#009BE2]">vocational training, asset transfer, and enterprise development support</strong> to help families rebuild their lives and achieve sustainable income sources.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Livelihood Options</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Small business development and entrepreneurship</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Agricultural diversification and improved farming</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Livestock rearing and poultry farming</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Fisheries and aquaculture development</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Handicrafts and small-scale manufacturing</li></ul></div></div>';
  }

  private function getInsuranceFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">A comprehensive social protection mechanism for our group members, combining <strong class="text-[#009BE2]">savings and insurance</strong> to provide financial security and risk coverage.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The scheme encourages regular savings habits while providing life insurance coverage, health benefits, and emergency support for member families during crises.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Benefits</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Life insurance coverage up to BDT 50,000</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Health and accident benefits</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Emergency loan facilities from savings</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Children\'s education support</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Old age security and retirement benefits</li></ul></div></div>';
  }

  private function getSocialDevelopmentFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Addressing social issues and promoting inclusive development through community mobilization and awareness programs.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The program focuses on <strong class="text-[#009BE2]">social justice, gender equality, child protection, and community empowerment</strong> to create a more equitable society.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Focus Areas</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Women empowerment and leadership development</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Child rights and protection committees</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Prevention of child marriage and dowry</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Community-led social audits and accountability</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Disability-inclusive development initiatives</li></ul></div></div>';
  }

  private function getLegalFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Promoting <strong class="text-[#009BE2]">access to justice and human rights protection</strong> for marginalized communities through legal aid, awareness, and advocacy.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We provide free legal counseling, support for victims of human rights violations, and conduct workshops on legal rights and entitlements.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Services</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Free legal aid and counseling clinics</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Human rights awareness campaigns</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Support for victims of violence and discrimination</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Land rights and property dispute resolution</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Paralegal training for community volunteers</li></ul></div></div>';
  }

  private function getWatsanFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Building on its long experience of providing water and sanitation services to communities, DUS started its <strong class="text-[#009BE2]">Water and Sanitation program</strong> with the financial and technical support of the Netherland Government.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The program is implementing in Nangolia Char and Nalerchar under Hatiya Upazilla. Our goal is to provide sustainable and integrated WATSAN services in the rural areas.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We break the contamination cycle of unsanitary latrines, contaminated water and unsafe hygiene practices, as well as ensure sustainability and scaling-up of WATSAN services.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Targets</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">4,605 households with sanitation access</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">250 deep tube wells for safe water</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">20,000 people with hygiene education</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Community-led total sanitation approaches</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">School WASH facilities and hygiene promotion</li></ul></div></div>';
  }

  private function getTrainingFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">DUS has developed a comprehensive <strong class="text-[#009BE2]">Training and Communication Unit</strong> fully equipped with all possible physical and human resources to deliver high-quality capacity building programs.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">We offer need-based training programs, develop modules and curriculum, and utilize modern training methodologies including participatory approaches, audio-visual aids, and practical demonstrations.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Training Offerings</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Skill development and vocational training</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Leadership and management training</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Financial literacy and business management</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">ToT (Training of Trainers) programs</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">MIS and data management training</li></ul></div></div>';
  }

  private function getTourismFullContent(): string
  {
    return '<div class="space-y-6"><div><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Promoting <strong class="text-[#009BE2]">sustainable tourism and hospitality</strong> as an emerging livelihood opportunity for coastal communities, leveraging the natural beauty and cultural heritage of Hatiya Island.</p><p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">This initiative focuses on developing community-based tourism, eco-tourism, and hospitality services that create employment while preserving local culture and environment.</p><h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Initiatives</h2><ul class="list-disc pl-6 space-y-3"><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Homestay and community guesthouse development</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Tour guide training and certification</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Handicraft and souvenir production</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Local cuisine and food service training</li><li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Eco-tourism and nature conservation awareness</li></ul></div></div>';
  }
}
