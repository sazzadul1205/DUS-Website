<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsProgramsController extends Controller
{
  use SharedDataTrait;

  /**
   * Display the projects & programs listing page
   */
  public function projectsPrograms(): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Mock SQL Data Structure - follows HomeController pattern
    $mockData = [
      'section_configs'          => $this->getProjectsProgramsSectionConfigs(),
      'banner_data'              => $this->getBannerData(),
      'our_programs_data'        => $this->getOurProgramsData($asset),
      'faq_data'                 => $this->getFaqData(),
    ];

    $transformedData = $this->transformAssetUrls($mockData, $asset);
    $pageData = $this->buildPageDataFromConfigs($transformedData);

    return Inertia::render('Frontend/ProjectsAndPrograms/ProjectsAndPrograms', array_merge(
      $this->getSharedData(),
      $pageData
    ));
  }

  /**
   * Display a single program details page
   */
  public function projectsProgramsDetails(string $slug): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Get all programs from SharedDataTrait (single source of truth)
    $allPrograms = $this->getAllProgramsData($asset);
    if (!isset($allPrograms[$slug])) {
      abort(404, 'Program not found');
    }
    $program = $allPrograms[$slug];

    $mockData = [
      'section_configs'          => $this->getProjectsProgramsDetailsSectionConfigs(),
      'banner_data'              => $this->getDetailsBannerData($program, $asset),
      'program_content_data'     => $this->getProgramContentData($program),
      'faq_data'                 => $this->getFaqData(),
      'upcoming_events_data'     => $this->getUpcomingEventsData($asset),
    ];

    $transformedData = $this->transformAssetUrls($mockData, $asset);
    $pageData = $this->buildPageDataFromConfigs($transformedData);

    // Add slug and program title separately if needed (or they are inside program_content_data)
    $pageData['slug'] = $slug;

    return Inertia::render('Frontend/ProjectsAndProgramsDetails/ProjectsAndProgramsDetails', array_merge(
      $this->getSharedData(),
      $pageData
    ));
  }

  // ==================== Section Configurations ====================

  private function getProjectsProgramsSectionConfigs(): array
  {
    return [
      [
        'id'                => 1,
        'page'              => 'projects-programs',
        'section_key'       => 'banner',
        'component'         => 'PageBannerSection',
        'enabled'           => true,
        'data_table'        => 'banner_data',
        'data_key'          => 'bannerData',
        'prop_name'         => 'bannerData',
        'display_order'     => 1,
        'is_fixed_section'  => false,
        'customProps'       => ['sectionId' => 'projects-programs-banner']
      ],
      [
        'id'                => 2,
        'page'              => 'projects-programs',
        'section_key'       => 'our-programs',
        'component'         => 'OurProgramsSection',
        'enabled'           => true,
        'data_table'        => 'our_programs_data',
        'data_key'          => 'ourProgramsData',
        'prop_name'         => 'programsData',
        'display_order'     => 2,
        'is_fixed_section'  => false,
        'customProps'       => []
      ],
      [
        'id'                => 3,
        'page'              => 'projects-programs',
        'section_key'       => 'faq',
        'component'         => 'FAQSection',
        'enabled'           => true,
        'data_table'        => 'faq_data',
        'data_key'          => 'faqData',
        'prop_name'         => 'faqData',
        'display_order'     => 3,
        'is_fixed_section'  => false,
        'customProps'       => []
      ],
    ];
  }

  private function getProjectsProgramsDetailsSectionConfigs(): array
  {
    return [
      [
        'id'                    => 1,
        'page'                  => 'projects-programs-details',
        'section_key'           => 'banner',
        'component'             => 'PageBannerSection',
        'enabled'               => true,
        'data_table'            => 'banner_data',
        'data_key'              => 'bannerData',
        'prop_name'             => 'bannerData',
        'display_order'         => 1,
        'is_fixed_section'      => false,
        'isSpecialComponent'    => false,
        'customProps'           => []
      ],
      [
        'id'                    => 2,
        'page'                  => 'projects-programs-details',
        'section_key'           => 'program-content',
        'component'             => 'ProgramContentSection',
        'enabled'               => true,
        'isSpecialComponent'    => true,
        'data_table'            => 'program_content_data',
        'data_key'              => 'programContentData',
        'prop_name'             => 'programData',
        'display_order'         => 2,
        'is_fixed_section'      => true, // ← MARKED AS FIXED
        'customProps'           => [
          'bgColor'   => 'bg-white',
          'paddingY'  => 'py-37.5',
          'paddingX'  => 'px-100'
        ]
      ],
      [
        'id'                    => 3,
        'page'                  => 'projects-programs-details',
        'section_key'           => 'faq',
        'component'             => 'FAQSection',
        'enabled'               => true,
        'data_table'            => 'faq_data',
        'data_key'              => 'faqData',
        'prop_name'             => 'faqData',
        'display_order'         => 3,
        'is_fixed_section'      => false,
        'isSpecialComponent'    => false,
        'customProps'           => []
      ],
      [
        'id'                    => 4,
        'page'                  => 'projects-programs-details',
        'section_key'           => 'upcoming-events',
        'component'             => 'UpcomingEventsSection',
        'enabled'               => true,
        'data_table'            => 'upcoming_events_data',
        'data_key'              => 'upcomingEventsData',
        'prop_name'             => 'eventsData',
        'display_order'         => 4,
        'is_fixed_section'      => false,
        'isSpecialComponent'    => false,
        'customProps'           => []
      ],
    ];
  }

  // ==================== Data Providers ====================

  private function getBannerData(): array
  {
    return [
      'id'          => 1,
      'page'        => 'projects-programs',
      'section_key' => 'banner',
      'data'        => [
        'background' => [
          'src'   => 'https://placehold.co/1920x589',
          'alt'   => 'Background'
        ],
        'overlay' => [
          'darkOverlay' => 'bg-black/40 lg:bg-black/50',
          'gradient'    => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
        ],
        'content' => [
          'title' => [
            'text'      => 'Meet Our Charity Projects',
            'className' => 'font-bold leading-tight'
          ],
        ],
      ],
    ];
  }

  private function getDetailsBannerData(array $program, callable $asset): array
  {
    return [
      'id'          => 1,
      'page'        => 'projects-programs-details',
      'section_key' => 'banner',
      'data'        => [
        'background' => [
          'src'   => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'),
          'alt'   => 'Background'
        ],
        'overlay' => [
          'darkOverlay' => 'bg-black/40 lg:bg-black/50',
          'gradient'    => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
        ],
        'content' => [
          'title' => [
            'text'      => $program['title'],
            'className' => 'font-bold leading-tight'
          ],
        ],
      ],
    ];
  }

  /**
   * Build programs listing data (including generated excerpts from full HTML)
   */
  private function getOurProgramsData(callable $asset): array
  {
    $allPrograms = $this->getAllProgramsData($asset);
    $programs = [];

    foreach ($allPrograms as $slug => $program) {
      $programs[] = [
        'id'          => $program['id'],
        'title'       => $program['title'],
        'description' => $this->generateExcerptFromHtml($program['fullContentHtml']),
        'image'       => $program['image'],
        'bgColor'     => $program['bgColor'],
        'link'        => $program['link'],
      ];
    }

    return [
      'id'          => 1,
      'page'        => 'projects-programs',
      'section_key' => 'our-programs',
      'data'        => ['programs' => $programs]
    ];
  }

  /**
   * Generate a plain‑text excerpt from HTML content.
   */
  private function generateExcerptFromHtml(string $html, int $length = 200): string
  {
    $text = preg_replace('/<(script|style)[^>]*>.*?<\/\\1>/is', '', $html);
    $text = strip_tags($text);
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/\s+/', ' ', $text);
    $text = trim($text);

    if (mb_strlen($text) > $length) {
      $text = mb_substr($text, 0, $length) . '...';
    }
    return $text;
  }

  private function getProgramContentData(array $program): array
  {
    return [
      'id'          => $program['id'],
      'page'        => 'projects-programs-details',
      'section_key' => 'program-content',
      'data'        => $program, // passes full program data (title, image, fullContentHtml, etc.)
    ];
  }

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

  // ==================== Helper: Build Page Data from Configs ====================

  private function buildPageDataFromConfigs(array $mockData): array
  {
    $pageData = [];
    $sectionConfigs = $mockData['section_configs'] ?? [];

    usort($sectionConfigs, fn($a, $b) => $a['display_order'] <=> $b['display_order']);

    foreach ($sectionConfigs as $config) {
      if (!$config['enabled']) {
        continue;
      }
      $dataTable = $config['data_table'];
      $dataKey = $config['data_key'];

      if (isset($mockData[$dataTable]) && isset($mockData[$dataTable]['data'])) {
        $pageData[$dataKey] = $mockData[$dataTable]['data'];
      }

      // Add customProps to section config (optional)
      if (!empty($config['customProps'])) {
        $pageData[$dataKey]['_customProps'] = $config['customProps'];
      }
    }

    // Build sectionConfig for frontend with all necessary flags
    $pageData['sectionConfig'] = [
      'sections' => array_map(function ($config) {
        return [
          'id'                    => $config['section_key'],
          'component'             => $config['component'],
          'enabled'               => $config['enabled'],
          'propName'              => $config['prop_name'],
          'dataKey'               => $config['data_key'],
          'order'                 => $config['display_order'],
          'customProps'           => $config['customProps'] ?? [],
          'isFixedSection'        => $config['is_fixed_section'] ?? false,
          'isSpecialComponent'    => $config['isSpecialComponent'] ?? false,
        ];
      }, $sectionConfigs)
    ];

    return $pageData;
  }
}
