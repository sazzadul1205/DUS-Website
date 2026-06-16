<?php
// app/Http/Controllers/Frontend/HomeController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
  use SharedDataTrait;

  /**
   * Display the home page
   */
  public function home(): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Mock SQL Data Structure - All data is JSON-serializable for database storage
    $mockData = [
      // Table: section_configs
      'section_configs' => $this->getSectionConfigs(),

      // Table: banner_data (JSON stored in database)
      'banner_data' => $this->getBannerData(),

      // Table: about_us_data (JSON stored in database)
      'about_us_data' => $this->getAboutUsData(),

      // Table: our_actions_data (JSON stored in database)
      'our_actions_data' => $this->getOurActionsData(),

      // Table: where_we_work_data (JSON stored in database)
      'where_we_work_data' => $this->getWhereWeWorkData(),

      // Table: our_programs_data (JSON stored in database)
      'our_programs_data' => $this->getOurProgramsData(),

      // Table: stories_data (JSON stored in database)
      'stories_data' => $this->getStoriesData(),

      // Table: upcoming_events_data (JSON stored in database)
      'upcoming_events_data' => $this->getUpcomingEventsData(),

      // Table: jobs_data (JSON stored in database)
      'jobs_data' => $this->getJobsData(),

      // Table: program_impact_data (JSON stored in database)
      'program_impact_data' => $this->getProgramImpactData(),
    ];

    // Transform mock data by replacing asset placeholders with actual URLs
    $transformedData = $this->transformAssetUrls($mockData, $asset);

    // Build page data from section configs
    $pageData = $this->buildPageDataFromConfigs($transformedData);

    return Inertia::render('Frontend/Home/Home', array_merge(
      $this->getSharedData(),
      $pageData
    ));
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
   * Get section configurations (Table: section_configs)
   */
  private function getSectionConfigs(): array
  {
    return [
      [
        'id' => 1,
        'page' => 'home',
        'section_key' => 'banner',
        'component' => 'HomeBanner',
        'enabled' => true,
        'data_table' => 'banner_data',
        'data_key' => 'bannerData',
        'prop_name' => 'bannerData',
        'display_order' => 1,
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 2,
        'page' => 'home',
        'section_key' => 'about-us',
        'component' => 'AboutUsSection',
        'enabled' => true,
        'data_table' => 'about_us_data',
        'data_key' => 'aboutUsData',
        'prop_name' => 'aboutUsData',
        'display_order' => 2,
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 3,
        'page' => 'home',
        'section_key' => 'our-action',
        'component' => 'OurActionSection',
        'enabled' => true,
        'data_table' => 'our_actions_data',
        'data_key' => 'ourActionData',
        'prop_name' => 'actionData',
        'display_order' => 3,
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 4,
        'page' => 'home',
        'section_key' => 'where-we-work',
        'component' => 'WhereWeWorkSection',
        'enabled' => true,
        'data_table' => 'where_we_work_data',
        'data_key' => 'whereWeWorkData',
        'prop_name' => 'workData',
        'display_order' => 4,
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 5,
        'page' => 'home',
        'section_key' => 'our-programs',
        'component' => 'OurProgramsSection',
        'enabled' => true,
        'data_table' => 'our_programs_data',
        'data_key' => 'ourProgramsData',
        'prop_name' => 'programsData',
        'display_order' => 5,
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 6,
        'page' => 'home',
        'section_key' => 'stories',
        'component' => 'StoriesSection',
        'enabled' => true,
        'data_table' => 'stories_data',
        'data_key' => 'storiesData',
        'prop_name' => 'storiesData',
        'display_order' => 6,
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 7,
        'page' => 'home',
        'section_key' => 'upcoming-events',
        'component' => 'UpcomingEventsSection',
        'enabled' => true,
        'data_table' => 'upcoming_events_data',
        'data_key' => 'upcomingEventsData',
        'prop_name' => 'eventsData',
        'display_order' => 7,
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 8,
        'page' => 'home',
        'section_key' => 'jobs',
        'component' => 'JobsSection',
        'enabled' => true,
        'data_table' => 'jobs_data',
        'data_key' => 'jobsData',
        'prop_name' => 'jobsData',
        'display_order' => 8,
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 9,
        'page' => 'home',
        'section_key' => 'program-impact',
        'component' => 'ProgramImpactSection',
        'enabled' => true,
        'data_table' => 'program_impact_data',
        'data_key' => 'programImpactData',
        'prop_name' => 'impactData',
        'display_order' => 9,
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
    ];
  }

  /**
   * Get Banner Data (Table: banner_data - JSON stored)
   */
  private function getBannerData(): array
  {
    return [
      'id' => 1,
      'page' => 'home',
      'section_key' => 'banner',
      'data' => [
        'background' => [
          'src' => 'asset:Banner/64065404ef679e54d2dabd90bba3b1744817c578.webp',
          'alt' => 'Background'
        ],
        'overlay' => [
          'darkOverlay' => 'bg-black/40 lg:bg-black/50',
          'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
        ],
        'content' => [
          'tagline' => [
            'text' => 'Together, We Create Impact',
            'className' => 'uppercase tracking-[4px] font-semibold'
          ],
          'title' => [
            'text' => 'Be the Light for Someone in Need',
            'className' => 'font-bold leading-tight'
          ],
          'description' => [
            'text' => 'Your kindness has the power to change lives. Join us in bringing hope, support, and brighter futures to those in need. Every donation makes a difference big or small.',
            'className' => 'font-normal leading-tight'
          ]
        ],
        'buttons' => [
          [
            'id' => 1,
            'text' => 'Become a Volunteer',
            'variant' => 'primary',
            'className' => 'bg-[#009BE2] text-white hover:bg-[#009BE2]/80',
            'icon' => true
          ],
          [
            'id' => 2,
            'text' => 'How can I help?',
            'variant' => 'secondary',
            'className' => 'bg-white/90 lg:bg-white text-black hover:bg-white',
            'icon' => true
          ]
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get About Us Data (Table: about_us_data - JSON stored)
   */
  private function getAboutUsData(): array
  {
    return [
      'id' => 1,
      'page' => 'home',
      'section_key' => 'about-us',
      'data' => [
        'section' => [
          'title' => 'About us',
          'description' => 'A Community based philanthropic and development organization emergence/dedicated to sustainable poverty reduction, entrepreneur\'s promotion and capacity building of the underprivileged directing towards a just society. Interventions, DUS strives to bring about positive change in the quality of life of the poor community of rural Bangladesh.',
          'button' => [
            'text' => 'More about us',
            'link' => '/about'
          ]
        ],
        'mission' => [
          'title' => 'The mission of our organization',
          'items' => [
            [
              'id' => 1,
              'icon' => 'asset:AboutUs/65af8a95ec6612fa3ef2941b_011-charity-1%201.svg',
              'title' => 'Education for All',
              'description' => 'Charity is dedicated to ensuring that every child has access to quality education.',
              'alt' => 'Education Icon'
            ],
            [
              'id' => 2,
              'icon' => 'asset:AboutUs/65af8a95c570e47bd1123b4e_033-hospital%201.svg',
              'title' => 'Health and Wellness',
              'description' => 'Our commitment to health and wellness extends across borders.',
              'alt' => 'Health Icon'
            ],
            [
              'id' => 3,
              'icon' => 'asset:AboutUs/65af8a95cee257c23ab03ff8_040-shelter%201.svg',
              'title' => 'Disaster Relief',
              'description' => 'In times of crisis, Charity responds swiftly to provide emergency relief.',
              'alt' => 'Disaster Relief Icon'
            ],
            [
              'id' => 4,
              'icon' => 'asset:AboutUs/65af8a958d27ad8d830434f4_022-family-1%201.svg',
              'title' => 'Community Development',
              'description' => 'Charity invests in sustainable community development projects to create.',
              'alt' => 'Community Development Icon'
            ]
          ]
        ],
        'impact' => [
          'title' => 'Impact In Numbers',
          'stats' => [
            ['id' => 1, 'value' => '20', 'suffix' => '+', 'label' => 'Years of Service'],
            ['id' => 2, 'value' => '15', 'suffix' => '+', 'label' => 'Project Program'],
            ['id' => 3, 'value' => '10', 'suffix' => '+', 'label' => 'Award Received']
          ]
        ],
        'image' => [
          'src' => 'asset:AboutUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.webp',
          'alt' => 'About Us Image'
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Our Actions Data (Table: our_actions_data - JSON stored)
   */
  private function getOurActionsData(): array
  {
    return [
      'id' => 1,
      'page' => 'home',
      'section_key' => 'our-action',
      'data' => [
        'section' => [
          'title' => 'Our Actions for Social Change',
          'description' => 'We turn compassion into action by implementing community-led programs, advocating for social justice, and promoting education, health, and equality'
        ],
        'actions' => [
          ['id' => 1, 'icon' => 'asset:OurActions/fi_1940611.svg', 'title' => 'Education', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Education Icon'],
          ['id' => 2, 'icon' => 'asset:OurActions/fi_14888982.svg', 'title' => 'Microfinance', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Microfinance Icon'],
          ['id' => 3, 'icon' => 'asset:OurActions/fi_3004451.svg', 'title' => 'Health', 'description' => 'Providing nutritious meals and groceries to individuals and families in need.', 'alt' => 'Health Icon'],
          ['id' => 4, 'icon' => 'asset:OurActions/fi_17316107.svg', 'title' => 'Organizational Development', 'description' => 'We empower underprivileged children with the opportunity to learn, grow, and succeed.', 'alt' => 'Organizational Development Icon'],
          ['id' => 5, 'icon' => 'asset:OurActions/fi_6786176.svg', 'title' => 'Climate Change', 'description' => 'From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.', 'alt' => 'Climate Change Icon'],
          ['id' => 6, 'icon' => 'asset:OurActions/fi_1176562.svg', 'title' => 'Human Rights', 'description' => 'From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.', 'alt' => 'Human Rights Icon'],
          ['id' => 7, 'icon' => 'asset:OurActions/fi_8992468.svg', 'title' => 'Human Resource', 'description' => 'Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.', 'alt' => 'Human Resource Icon'],
          ['id' => 8, 'icon' => 'asset:OurActions/fi_726211.svg', 'title' => 'Social Enterprises', 'description' => 'We empower communities by investing in sustainable projects, training livelihood programs.', 'alt' => 'Social Enterprises Icon'],
          ['id' => 9, 'icon' => 'asset:OurActions/fi_4994126.svg', 'title' => 'Agriculture Food Security', 'description' => 'Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.', 'alt' => 'Agriculture Food Security Icon']
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Where We Work Data (Table: where_we_work_data - JSON stored)
   */
  private function getWhereWeWorkData(): array
  {
    return [
      'id' => 1,
      'page' => 'home',
      'section_key' => 'where-we-work',
      'data' => [
        'section' => ['title' => 'Where We Work'],
        'stats' => [
          ['id' => 1, 'icon' => 'asset:WhereWeWork/image%206-3.png', 'value' => '450K', 'label' => 'Total Member Reach', 'alt' => 'Member Reach Icon'],
          ['id' => 2, 'icon' => 'asset:WhereWeWork/image%206-2.png', 'value' => '41,382', 'label' => 'Mail Engaged in Divers Livelihoods Options', 'alt' => 'Member Reach Icon'],
          ['id' => 3, 'icon' => 'asset:WhereWeWork/image%206-1.png', 'value' => '35,193', 'label' => 'Women Engaged in Diverse Livelihoods Options', 'alt' => 'Member Reach Icon'],
          ['id' => 4, 'icon' => 'asset:WhereWeWork/image%206.png', 'value' => '35,193', 'label' => 'Women Engaged in Diverse Livelihoods Options', 'alt' => 'Mail Engaged Icon'],
          ['id' => 5, 'icon' => 'asset:WhereWeWork/image%206-1.png', 'value' => '38.0 M', 'label' => 'Digital media Outreach', 'alt' => 'Women Engaged Icon'],
          ['id' => 6, 'icon' => 'asset:WhereWeWork/image%206.png', 'value' => '35,193', 'label' => 'Women Engagement in Diverse Livelihood Options', 'alt' => 'Mail Engaged Icon']
        ],
        'image' => [
          'src' => 'asset:WhereWeWork/image.png',
          'alt' => 'Map Place holder Text',
          'className' => 'w-full h-232.5 object-cover rounded-4xl'
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Our Programs Data (Table: our_programs_data - JSON stored)
   */
  private function getOurProgramsData(): array
  {
    return [
      'id' => 1,
      'page' => 'home',
      'section_key' => 'our-programs',
      'data' => [
        'section' => [
          'title' => 'Our Programs',
          'description' => 'Transforming lives through sustainable development initiatives and community empowerment programs.',
          'button' => [
            'text' => 'View all Projects and programs',
            'link' => '/projects-programs'
          ]
        ],
        'programs' => [
          [
            'id' => 1,
            'title' => 'Micro-Finance <br /> Program',
            'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Micro finance Program is the core program of DUS activities implemented in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to 40K+ group members where 97% are female.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The program includes savings schemes for poor women with no access to mainstream banks, helping them promote income generating activities and achieve economic empowerment.</p></div>',
            'image' => 'asset:OurPrograms/945e2496664a40b12a1cddd6561e954cdc78e255.webp',
            'bgColor' => 'bg-[#E6F3E7]',
            'link' => '/projects-programs/micro-finance'
          ],
          [
            'id' => 2,
            'title' => 'Climate Change and <br /> Disaster Management',
            'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS operates in highly disaster-prone coastal areas of Bangladesh, working with communities to build <strong class="text-[#009BE2]">resilience against natural disasters</strong> like cyclones, floods, and storm surges.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Moving beyond relief, we focus on institutionalized preparedness, risk reduction, early warning systems, and long-term climate adaptation strategies for vulnerable coastal communities.</p></div>',
            'image' => 'asset:OurPrograms/a03fa6dba9fcdac0a5aedf2d337b118228a03298.webp',
            'bgColor' => 'bg-[#F3EDE6]',
            'link' => '/projects-programs/climate-change'
          ],
          [
            'id' => 3,
            'title' => 'Community Radio',
            'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Empowering Hatiya Island communities by giving them a <strong class="text-[#009BE2]">voice for change</strong> through community radio. Bangladesh is the 2nd country in South Asia with a Community Radio Policy.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The radio broadcasts agricultural information, health awareness, local news, women empowerment programs, and cultural content, reaching thousands of listeners daily.</p></div>',
            'image' => 'asset:OurPrograms/e280b627b1771904c38022aac2566b932e248887.webp',
            'bgColor' => 'bg-[#E8E6F3]',
            'link' => '/projects-programs/community-radio'
          ],
          [
            'id' => 4,
            'title' => 'Research and <br /> Documentation',
            'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">DUS has a strong <strong class="text-[#009BE2]">Research and Documentation Cell</strong> conducting quality research in education, health, livelihood, environment, human rights, and social justice.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">The cell engages in surveys, impact assessments, and documentation of best practices, helping shape effective development interventions and policy advocacy.</p></div>',
            'image' => 'asset:OurPrograms/a496922a3fc00992b6c454822d60bde51dc001e5.webp',
            'bgColor' => 'bg-[#F3E6EA]',
            'link' => '/projects-programs/research-documentation'
          ],
          [
            'id' => 5,
            'title' => 'WATSAN <br /> Program',
            'description' => '<div class="space-y-3"><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Providing sustainable <strong class="text-[#009BE2]">water and sanitation services</strong> to rural communities with support from the Netherland Government, implemented in Nangolia Char and Nalerchar under Hatiya Upazilla.</p><p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#524B48] leading-relaxed">Target: 4,605 households with sanitation, 250 deep tube wells for safe water, and hygiene education for 20,000 people.</p></div>',
            'image' => 'asset:OurPrograms/be14c45848898048e7b7832affc4dc713b032e10.webp',
            'bgColor' => 'bg-[#F2F3E6]',
            'link' => '/projects-programs/watsan'
          ]
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Stories Data (Table: stories_data - JSON stored)
   */
  private function getStoriesData(): array
  {
    return [
      'id' => 1,
      'page' => 'home',
      'section_key' => 'stories',
      'data' => [
        'section' => [
          'title' => 'Insights, Stories & Impact',
          'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.'
        ],
        'stories' => [
          [
            'id' => 1,
            'image' => 'asset:Stories/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp',
            'date' => 'June 6, 2023',
            'title' => 'Invest in Kindness, Reap a Better Future',
            'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
            'link' => '/stories/invest-in-kindness'
          ],
          [
            'id' => 2,
            'image' => 'asset:Stories/b3d758bf8cd7985c857cdbe55b5101b105ee9f75.webp',
            'date' => 'June 6, 2023',
            'title' => 'How to Design a Custom Pool That Perfectly Fits Your Charlotte Backyard',
            'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
            'link' => '/stories/custom-pool-design'
          ],
          [
            'id' => 3,
            'image' => 'asset:Stories/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp',
            'date' => 'June 6, 2023',
            'title' => 'The Benefits of Mindfulness in Daily Life',
            'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
            'link' => '/stories/mindfulness-benefits'
          ],
          [
            'id' => 4,
            'image' => 'asset:Stories/3fe55eb9ebcfd7efb80f559a00b8b5a1da0e8c3e.webp',
            'date' => 'July 15, 2023',
            'title' => 'Empowering Women Through Microfinance',
            'description' => 'Discover how small loans are making a big difference...',
            'link' => '/stories/empowering-women'
          ],
          [
            'id' => 5,
            'image' => 'asset:Stories/de90e922c05aa3585b8f65361c306413c3b3d7be.webp',
            'date' => 'August 2, 2023',
            'title' => 'Building Resilient Communities Against Climate Change',
            'description' => 'Learn about our initiatives to help coastal communities...',
            'link' => '/stories/climate-resilience'
          ],
          [
            'id' => 6,
            'image' => 'asset:Stories/f465fcbdab4004cd25dba4df06b9f8d5f2648620.webp',
            'date' => 'September 10, 2023',
            'title' => 'Providing Clean Water to Remote Villages',
            'description' => 'Access to clean water is a basic human right...',
            'link' => '/stories/clean-water'
          ]
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Upcoming Events Data (Table: upcoming_events_data - JSON stored)
   */
  private function getUpcomingEventsData(): array
  {
    return [
      'id' => 1,
      'page' => 'home',
      'section_key' => 'upcoming-events',
      'data' => [
        'section' => [
          'title' => 'Upcoming Events',
          'description' => 'Join us in making a difference through these upcoming events and initiatives.'
        ],
        'events' => [
          [
            'id' => 1,
            'title' => 'Annual Charity Gala',
            'date' => 'December 15, 2024',
            'location' => 'Dhaka, Bangladesh',
            'description' => 'Join us for an evening of celebration and fundraising to support our education programs.',
            'link' => '/events/annual-charity-gala'
          ],
          [
            'id' => 2,
            'title' => 'Community Health Camp',
            'date' => 'January 5-7, 2025',
            'location' => 'Hatiya, Noakhali',
            'description' => 'Free health checkups and medical consultation for underserved communities.',
            'link' => '/events/community-health-camp'
          ],
          [
            'id' => 3,
            'title' => 'Climate Action Workshop',
            'date' => 'February 10, 2025',
            'location' => 'Chattogram',
            'description' => 'Learn about climate resilience strategies and disaster preparedness.',
            'link' => '/events/climate-action-workshop'
          ]
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Jobs Data (Table: jobs_data - JSON stored)
   */
  private function getJobsData(): array
  {
    return [
      'id' => 1,
      'page' => 'home',
      'section_key' => 'jobs',
      'data' => [
        'section' => [
          'title' => 'Join our big family',
          'description' => 'Join us on this journey of kindness, and let\'s make a difference, one act of charity at a time.'
        ],
        'filter' => [
          'placeholder' => 'Browse By',
          'options' => [
            ['value' => '', 'label' => 'Browse By'],
            ['value' => 'all', 'label' => 'All Jobs'],
            ['value' => 'full-time', 'label' => 'Full Time'],
            ['value' => 'part-time', 'label' => 'Part Time'],
            ['value' => 'contract', 'label' => 'Contract'],
            ['value' => 'remote', 'label' => 'Remote'],
            ['value' => 'internship', 'label' => 'Internship']
          ]
        ],
        'jobs' => [
          [
            'id' => 1,
            'type' => 'Full time',
            'department' => 'Management',
            'location' => 'Dhaka, Bangladesh',
            'title' => 'Senior Program Manager - Microfinance',
            'description' => 'Lead and oversee microfinance program operations, manage team of field officers, and ensure sustainable financial inclusion for underserved communities.',
            'link' => '/jobs/senior-program-manager'
          ],
          [
            'id' => 2,
            'type' => 'Part time',
            'department' => 'Development',
            'location' => 'Anywhere in Bangladesh',
            'title' => 'Program Coordinator - Youth Empowerment',
            'description' => 'Develop and deliver workshops, mentorship programs, and educational events for underprivileged youth to build essential life skills.',
            'link' => '/jobs/youth-coordinator'
          ],
          [
            'id' => 3,
            'type' => 'Full time',
            'department' => 'Climate Action',
            'location' => 'Hatiya, Noakhali',
            'title' => 'Climate Change Specialist',
            'description' => 'Design and implement climate adaptation strategies, conduct risk assessments, and train communities on disaster preparedness.',
            'link' => '/jobs/climate-specialist'
          ],
          [
            'id' => 4,
            'type' => 'Contract',
            'department' => 'Research',
            'location' => 'Remote',
            'title' => 'Research Associate - Impact Assessment',
            'description' => 'Conduct qualitative and quantitative research, analyze program data, and prepare impact reports for stakeholders.',
            'link' => '/jobs/research-associate'
          ],
          [
            'id' => 5,
            'type' => 'Internship',
            'department' => 'Media',
            'location' => 'Chattogram',
            'title' => 'Radio Production Intern',
            'description' => 'Assist in content creation, audio production, and community outreach programs for our community radio station.',
            'link' => '/jobs/radio-intern'
          ]
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Program Impact Data (Table: program_impact_data - JSON stored)
   */
  private function getProgramImpactData(): array
  {
    return [
      'id' => 1,
      'page' => 'home',
      'section_key' => 'program-impact',
      'data' => [
        'section' => [
          'title' => 'Program Impact and SDGs',
          'mainImage' => [
            'images' => [
              'asset:ProgramImpact/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp',
              'asset:ProgramImpact/64065404ef679e54d2dabd90bba3b1744817c578.webp',
              'asset:ProgramImpact/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp',
              'asset:ProgramImpact/64065404ef679e54d2dabd90bba3b1744817c578.webp'
            ]
          ]
        ],
        'sdgImages' => [
          ['id' => 1, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18732_www.figma.com.webp', 'alt' => 'No Poverty'],
          ['id' => 2, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18742_www.figma.com.webp', 'alt' => 'Zero Hunger'],
          ['id' => 3, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18750_www.figma.com.webp', 'alt' => 'Good Health'],
          ['id' => 4, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_1887_www.figma.com.webp', 'alt' => 'Quality Education'],
          ['id' => 5, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18823_www.figma.com.webp', 'alt' => 'Gender Equality'],
          ['id' => 6, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18837_www.figma.com.webp', 'alt' => 'Clean Water'],
          ['id' => 7, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_1894_www.figma.com.webp', 'alt' => 'Clean Energy'],
          ['id' => 8, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18913_www.figma.com.webp', 'alt' => 'Decent Work'],
          ['id' => 9, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18920_www.figma.com.webp', 'alt' => 'Industry Innovation'],
          ['id' => 10, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18930_www.figma.com.webp', 'alt' => 'Reduced Inequalities'],
          ['id' => 11, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18939_www.figma.com.webp', 'alt' => 'Sustainable Cities'],
          ['id' => 12, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18949_www.figma.com.webp', 'alt' => 'Responsible Consumption'],
          ['id' => 13, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_18108_www.figma.com.webp', 'alt' => 'Climate Action'],
          ['id' => 14, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_181017_www.figma.com.webp', 'alt' => 'Life Below Water'],
          ['id' => 15, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_181031_www.figma.com.webp', 'alt' => 'Life On Land'],
          ['id' => 16, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_181046_www.figma.com.webp', 'alt' => 'Peace Justice'],
          ['id' => 17, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_181055_www.figma.com.webp', 'alt' => 'Partnerships'],
          ['id' => 18, 'src' => 'asset:ProgramImpact/Screenshot_17-5-2026_181133_www.figma.com.webp', 'alt' => 'SDG 18']
        ]
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Build page data from section configs
   */
  private function buildPageDataFromConfigs(array $mockData): array
  {
    $pageData = [];
    $sectionConfigs = $mockData['section_configs'];

    // Sort by display order
    usort($sectionConfigs, function ($a, $b) {
      return $a['display_order'] <=> $b['display_order'];
    });

    foreach ($sectionConfigs as $config) {
      if (!$config['enabled']) {
        continue;
      }

      $dataTable = $config['data_table'];
      $propName = $config['prop_name'];
      $dataKey = $config['data_key'];

      if (isset($mockData[$dataTable]) && isset($mockData[$dataTable]['data'])) {
        $pageData[$dataKey] = $mockData[$dataTable]['data'];
      }
    }

    // Add section config for frontend use
    $pageData['sectionConfig'] = [
      'sections' => array_map(function ($config) {
        return [
          'id' => $config['section_key'],
          'component' => $config['component'],
          'enabled' => $config['enabled'],
          'propName' => $config['prop_name'],
          'dataKey' => $config['data_key'],
          'order' => $config['display_order']
        ];
      }, $sectionConfigs)
    ];

    return $pageData;
  }
}
