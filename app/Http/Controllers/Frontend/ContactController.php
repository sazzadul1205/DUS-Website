<?php
// app/Http/Controllers/Frontend/ContactController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
  use SharedDataTrait;

  /**
   * Display the contact us page
   */
  public function contactUs(): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Mock SQL Data Structure - follows HomeController pattern
    $mockData = [
      // Table: section_configs
      'section_configs' => $this->getContactUsSectionConfigs(),

      // Table: banner_data (JSON stored in database)
      'banner_data' => $this->getBannerData(),

      // Table: offices_data (JSON stored in database)
      'offices_data' => $this->getOfficesData(),

      // Table: social_items_data (JSON stored in database)
      'social_items_data' => $this->getSocialItemsData(),

      // Table: contact_reach_data (JSON stored in database)
      'contact_reach_data' => $this->getContactReachData($asset),

      // Table: offices_location_data (JSON stored in database)
      'offices_location_data' => $this->getOfficesLocationData(),

      // Table: faq_data (JSON stored in database)
      'faq_data' => $this->getFaqData(),

      // Table: stories_data (JSON stored in database)
      'stories_data' => $this->getStoriesData(),

      // Table: upcoming_events_data (JSON stored in database)
      'upcoming_events_data' => $this->getUpcomingEventsData($asset),
    ];

    // Transform mock data by replacing asset placeholders with actual URLs
    $transformedData = $this->transformAssetUrls($mockData, $asset);

    // Build page data from section configs
    $pageData = $this->buildPageDataFromConfigs($transformedData);

    return Inertia::render('Frontend/ContactUs/ContactUs', array_merge(
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
  private function getContactUsSectionConfigs(): array
  {
    return [
      [
        'id' => 1,
        'page' => 'contact',
        'section_key' => 'banner',
        'component' => 'PageBannerSection',
        'enabled' => true,
        'data_table' => 'banner_data',
        'data_key' => 'bannerData',
        'prop_name' => 'bannerData',
        'display_order' => 1,
        'is_fixed_section' => false,
        'customProps' => ['sectionId' => 'contact-us-banner'],
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 2,
        'page' => 'contact',
        'section_key' => 'contact-offices',
        'component' => 'ContactOfficeSection',
        'enabled' => true,
        'data_table' => 'offices_data',
        'data_key' => 'offices',
        'prop_name' => 'offices',
        'display_order' => 2,
        'is_fixed_section' => false,
        'customProps' => [],
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 3,
        'page' => 'contact',
        'section_key' => 'contact-reach',
        'component' => 'ContactReachSection',
        'enabled' => true,
        'data_table' => 'contact_reach_data',
        'data_key' => 'reachUsData',
        'prop_name' => 'image',
        'display_order' => 3,
        'is_fixed_section' => false,
        'customProps' => [],
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 4,
        'page' => 'contact',
        'section_key' => 'follow-us',
        'component' => 'FollowUSSection',
        'enabled' => true,
        'data_table' => 'social_items_data',
        'data_key' => 'socialItems',
        'prop_name' => 'socialItems',
        'display_order' => 4,
        'is_fixed_section' => false,
        'customProps' => [],
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 5,
        'page' => 'contact',
        'section_key' => 'address',
        'component' => 'AddressSection',
        'enabled' => true,
        'data_table' => 'offices_location_data',
        'data_key' => 'officesLocation',
        'prop_name' => 'officesLocation',
        'display_order' => 5,
        'is_fixed_section' => false,
        'customProps' => [],
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 6,
        'page' => 'contact',
        'section_key' => 'faq',
        'component' => 'FAQSection',
        'enabled' => true,
        'data_table' => 'faq_data',
        'data_key' => 'faqData',
        'prop_name' => 'faqData',
        'display_order' => 6,
        'is_fixed_section' => false,
        'customProps' => ['bgColor' => 'bg-white'],
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 7,
        'page' => 'contact',
        'section_key' => 'stories',
        'component' => 'StoriesSection',
        'enabled' => true,
        'data_table' => 'stories_data',
        'data_key' => 'storiesData',
        'prop_name' => 'storiesData',
        'display_order' => 7,
        'is_fixed_section' => false,
        'customProps' => [],
        'created_at' => '2024-01-01 00:00:00',
        'updated_at' => '2024-01-01 00:00:00'
      ],
      [
        'id' => 8,
        'page' => 'contact',
        'section_key' => 'upcoming-events',
        'component' => 'UpcomingEventsSection',
        'enabled' => true,
        'data_table' => 'upcoming_events_data',
        'data_key' => 'upcomingEventsData',
        'prop_name' => 'eventsData',
        'display_order' => 8,
        'is_fixed_section' => false,
        'customProps' => [],
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
      'page' => 'contact',
      'section_key' => 'banner',
      'data' => [
        'background' => [
          'src' => 'asset:OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png',
          'alt' => 'Background'
        ],
        'overlay' => [
          'darkOverlay' => 'bg-black/40 lg:bg-black/50',
          'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
        ],
        'content' => [
          'title' => [
            'text' => "Let's Get in Touch",
            'className' => 'font-bold leading-tight'
          ],
          'description' => [
            'text' => 'Reach out today and let\'s create meaningful, lasting positive change together worldwide',
            'className' => 'font-normal leading-tight'
          ]
        ],
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Offices Data (Table: offices_data - JSON stored)
   */
  private function getOfficesData(): array
  {
    return [
      'id' => 1,
      'page' => 'contact',
      'section_key' => 'contact-offices',
      'data' => [
        [
          'title' => "Head Office",
          'address' => "24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka -1207.",
          'phones' => ["+880 1761-493412", "+880 1781 732352"],
          'emails' => ["dusdhaka@gmail.com", "dus.eddus@gmail.com"],
          'map_url' => "https://www.google.com/maps?q=23.7570,90.3620&output=embed",
          'coordinates' => ['lat' => 23.7570, 'lng' => 90.3620],
          'is_active' => true
        ],
        [
          'title' => "Regional Office",
          'address' => "Delower Commission Road, Sonapur, Sadar, Noakhali",
          'phones' => ["+880 1761-493411", "+880 1761-493414"],
          'emails' => ["dusreg@gmail.com"],
          'map_url' => "https://www.google.com/maps?q=22.8256,91.1039&output=embed",
          'coordinates' => ['lat' => 22.8256, 'lng' => 91.1039],
          'is_active' => false
        ],
        [
          'title' => "Foundation Office",
          'address' => "DUS Centre, Sayedia Bazar, Hatiya, Noakhali",
          'phones' => ["+880 1761-493418", "+880 1673-011347"],
          'emails' => ["dusreg@gmail.com"],
          'map_url' => "https://www.google.com/maps?q=22.4082,91.0909&output=embed",
          'coordinates' => ['lat' => 22.4082, 'lng' => 91.0909],
          'is_active' => false
        ],
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Social Items Data (Table: social_items_data - JSON stored)
   */
  private function getSocialItemsData(): array
  {
    return [
      'id' => 1,
      'page' => 'contact',
      'section_key' => 'follow-us',
      'data' => [
        ['icon' => 'facebook', 'label' => 'Facebook', 'url' => '#'],
        ['icon' => 'instagram', 'label' => 'Instagram', 'url' => '#'],
        ['icon' => 'linkedin', 'label' => 'LinkedIn', 'url' => '#'],
        ['icon' => 'youtube', 'label' => 'YouTube', 'url' => '#'],
        ['icon' => 'twitter', 'label' => 'X', 'url' => '#'],
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Contact Reach Data (Table: contact_reach_data - JSON stored)
   */
  private function getContactReachData(callable $asset): array
  {
    return [
      'id' => 1,
      'page' => 'contact',
      'section_key' => 'contact-reach',
      'data' => [
        'image' => 'asset:ContactUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.jpg',
        'title' => 'Reach out to us today!',
        'buttonText' => 'Submit Message'
      ],
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get Offices Location Data (Table: offices_location_data - JSON stored)
   */
  private function getOfficesLocationData(): array
  {
    // Get offices data to build location data
    $offices = $this->getOfficesData()['data'];

    $locationData = array_map(function ($office) {
      return [
        'id' => strtolower(str_replace(' ', '-', $office['title'])),
        'label' => $office['title'],
        'address' => $office['address'],
        'mapUrl' => $office['map_url'],
        'coordinates' => $office['coordinates'],
        'phones' => $office['phones'],
        'emails' => $office['emails'],
      ];
    }, $offices);

    return [
      'id' => 1,
      'page' => 'contact',
      'section_key' => 'address',
      'data' => $locationData,
      'created_at' => '2024-01-01 00:00:00',
      'updated_at' => '2024-01-01 00:00:00'
    ];
  }

  /**
   * Get FAQ Data (Table: faq_data - JSON stored)
   */
  private function getFaqData(): array
  {
    $config = $this->getFaqConfigs();
    return [
      'id'          => $config['id'],
      'page'        => $config['page'],
      'section_key' => 'faq',
      'data'        => $config['data'],
    ];
  }

  /**
   * Get Stories Data (Table: stories_data - JSON stored)
   */
  private function getStoriesData(): array
  {
    return [
      'id' => 1,
      'page' => 'contact',
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

  private function getUpcomingEventsData(callable $asset): array
  {
    $config = $this->getUpcomingEventsConfigs();
    // transform asset URLs inside the config data
    $transformedData = $this->transformAssetUrls($config['data'], $asset);
    return [
      'id'          => $config['id'],
      'page'        => $config['page'],
      'section_key' => 'upcoming-events',
      'data'        => $transformedData,
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

      // Add customProps to section data if any
      if (!empty($config['customProps']) && isset($pageData[$dataKey])) {
        $pageData[$dataKey]['_customProps'] = $config['customProps'];
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
          'order' => $config['display_order'],
          'customProps' => $config['customProps'] ?? [],
          'isFixedSection' => $config['is_fixed_section'] ?? false,
          'isSpecialComponent' => $config['isSpecialComponent'] ?? false,
        ];
      }, $sectionConfigs)
    ];

    return $pageData;
  }
}
