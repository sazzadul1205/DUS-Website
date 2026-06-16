<?php
// app/Http/Controllers/Frontend/BlogController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
  use SharedDataTrait;

  /**
   * Display the blogs page (frontend public blogs listing)
   */
  public function blogs(): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Mock SQL Data Structure - follows ProjectsProgramsController pattern
    $mockData = [
      'section_configs'   => $this->getBlogsSectionConfigs(),
      'banner_data'       => $this->getBannerData($asset),
      'blogs_data'        => $this->getBlogsData($asset),
      'faq_data'          => $this->getFaqData(),
    ];

    $transformedData = $this->transformAssetUrls($mockData, $asset);
    $pageData = $this->buildPageDataFromConfigs($transformedData);

    return Inertia::render('Frontend/Blogs/Blogs', array_merge(
      $this->getSharedData(),
      $pageData
    ));
  }

  /**
   * Display blog details page
   */
  public function blogDetails(string $slug): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Get all blogs from SharedDataTrait (single source of truth)
    $allBlogs = $this->getAllBlogsData($asset);
    if (!isset($allBlogs[$slug])) {
      abort(404, 'Blog post not found');
    }
    $blog = $allBlogs[$slug];

    $mockData = [
      'section_configs'       => $this->getBlogDetailsSectionConfigs(),
      'banner_data'           => $this->getDetailsBannerData($blog, $asset),
      'blog_content_data'     => $this->getBlogContentData($blog),
      'related_blogs_data'    => $this->getRelatedBlogsData($allBlogs, $slug),
      'upcoming_events_data'  => $this->getUpcomingEventsData($asset),
    ];

    $transformedData = $this->transformAssetUrls($mockData, $asset);
    $pageData = $this->buildPageDataFromConfigs($transformedData);
    $pageData['slug'] = $slug;

    return Inertia::render('Frontend/BlogDetails/BlogDetails', array_merge(
      $this->getSharedData(),
      $pageData
    ));
  }

  // ==================== Section Configurations ====================

  private function getBlogsSectionConfigs(): array
  {
    return [
      [
        'id'                => 1,
        'page'              => 'blogs',
        'section_key'       => 'banner',
        'component'         => 'PageBannerSection',
        'enabled'           => true,
        'data_table'        => 'banner_data',
        'data_key'          => 'bannerData',
        'prop_name'         => 'bannerData',
        'display_order'     => 1,
        'is_fixed_section'  => false,
        'customProps'       => ['sectionId' => 'blogs-banner']
      ],
      [
        'id'                => 2,
        'page'              => 'blogs',
        'section_key'       => 'blog-section',
        'component'         => 'BlogSection',
        'enabled'           => true,
        'data_table'        => 'blogs_data',
        'data_key'          => 'blogsData',
        'prop_name'         => 'blogsData',
        'display_order'     => 2,
        'is_fixed_section'  => false,
        'customProps'       => []
      ],
      [
        'id'                => 3,
        'page'              => 'blogs',
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

  private function getBlogDetailsSectionConfigs(): array
  {
    return [
      [
        'id'                    => 1,
        'page'                  => 'blog-details',
        'section_key'           => 'banner',
        'component'             => 'BannerSection',
        'enabled'               => true,
        'isSpecialComponent'    => true,
        'data_table'            => 'banner_data',
        'data_key'              => 'bannerData',
        'prop_name'             => 'bannerData',
        'display_order'         => 1,
        'is_fixed_section'      => true,
        'customProps'           => []
      ],
      [
        'id'                    => 2,
        'page'                  => 'blog-details',
        'section_key'           => 'blog-content',
        'component'             => 'BlogContentSection',
        'enabled'               => true,
        'isSpecialComponent'    => true,
        'data_table'            => 'blog_content_data',
        'data_key'              => 'blogData',
        'prop_name'             => 'blogData',
        'display_order'         => 2,
        'is_fixed_section'      => true,
        'customProps'           => [
          'bgColor'   => 'bg-white',
          'paddingY'  => 'py-12 lg:py-16',
          'paddingX'  => 'px-4'
        ]
      ],
      [
        'id'                    => 3,
        'page'                  => 'blog-details',
        'section_key'           => 'related-blogs',
        'component'             => 'BlogSection',
        'enabled'               => true,
        'data_table'            => 'related_blogs_data',
        'data_key'              => 'relatedBlogsData',
        'prop_name'             => 'blogsData',
        'display_order'         => 3,
        'is_fixed_section'      => false,
        'customProps'           => [
          'bgColor' => 'bg-[#F5F5F5]',
          'sectionTitle' => 'Related Blogs',
          'isRelated' => true
        ]
      ],
      [
        'id'                    => 4,
        'page'                  => 'blog-details',
        'section_key'           => 'upcoming-events',
        'component'             => 'UpcomingEventsSection',
        'enabled'               => true,
        'data_table'            => 'upcoming_events_data',
        'data_key'              => 'upcomingEventsData',
        'prop_name'             => 'eventsData',
        'display_order'         => 4,
        'is_fixed_section'      => false,
        'customProps'           => []
      ],
    ];
  }

  // ==================== Data Providers ====================

  private function getBannerData(callable $asset): array
  {
    return [
      'data' => [  // ✅ ADDED 'data' wrapper
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
            'text' => 'Blog',
            'className' => 'font-bold leading-tight'
          ],
        ],
      ]
    ];
  }

  private function getDetailsBannerData(array $blog, callable $asset): array
  {
    return [
      'data' => [  // ✅ ADDED 'data' wrapper
        'background' => [
          'src' => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'),
          'alt' => 'Background'
        ],
        'overlay' => [
          'darkOverlay' => 'bg-black/40 lg:bg-black/70',
        ],
      ]
    ];
  }

  /**
   * Build blogs listing data
   */
  private function getBlogsData(callable $asset): array
  {
    $allBlogs = $this->getAllBlogsData($asset);
    $mainBlog = null;
    $blogPosts = [];

    foreach ($allBlogs as $slug => $blog) {
      $blogItem = [
        'id' => $blog['id'],
        'date' => $blog['date'],
        'title' => $blog['title'],
        'description' => $blog['excerpt'],
        'image' => $blog['image'],
        'slug' => $blog['slug'],
        'tags' => $blog['tags'],
        'createdBy' => $blog['createdBy'],
        'timerRead' => $blog['timerRead']
      ];

      // First blog is main/featured
      if ($mainBlog === null) {
        $mainBlog = $blogItem;
      } else {
        $blogPosts[] = $blogItem;
      }
    }

    return [
      'data' => [  // ✅ ADDED 'data' wrapper
        'mainBlog' => $mainBlog,
        'blogPosts' => $blogPosts
      ]
    ];
  }

  private function getBlogContentData(array $blog): array
  {
    return [
      'data' => $blog  // ✅ ADDED 'data' wrapper
    ];
  }

  /**
   * Get Related Blogs Data (excluding current, limit to 3)
   */
  private function getRelatedBlogsData(array $allBlogs, string $currentSlug): array
  {
    $relatedBlogs = [];

    foreach ($allBlogs as $slug => $blog) {
      if ($slug !== $currentSlug) {
        $relatedBlogs[] = [
          'id' => $blog['id'],
          'date' => $blog['date'],
          'title' => $blog['title'],
          'description' => $blog['excerpt'],
          'image' => $blog['image'],
          'slug' => $blog['slug'],
          'tags' => $blog['tags'],
          'createdBy' => $blog['createdBy'],
          'timerRead' => $blog['timerRead']
        ];
      }
    }

    // Limit to 3
    return [
      'data' => array_slice($relatedBlogs, 0, 3)  // ✅ ADDED 'data' wrapper
    ];
  }

  private function getFaqData(): array
  {
    $config = $this->getFaqConfigs();
    return [
      'data' => $config['data']  // ✅ ADDED 'data' wrapper
    ];
  }

  private function getUpcomingEventsData(callable $asset): array
  {
    $config = $this->getUpcomingEventsConfigs();
    return [
      'data' => $this->transformAssetUrls($config['data'], $asset)  // ✅ ADDED 'data' wrapper
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

      // ✅ FIXED: Check for 'data' key like ProjectsProgramsController
      if (isset($mockData[$dataTable]) && isset($mockData[$dataTable]['data'])) {
        $pageData[$dataKey] = $mockData[$dataTable]['data'];
      }

      // BlogSection expects flat props: mainBlog + blogPosts
      if (
        $config['component'] === 'BlogSection'
        && isset($pageData[$dataKey])
        && is_array($pageData[$dataKey])
        && isset($pageData[$dataKey]['mainBlog'])
      ) {
        $pageData['mainBlog'] = $pageData[$dataKey]['mainBlog'] ?? null;
        $pageData['blogPosts'] = $pageData[$dataKey]['blogPosts'] ?? [];
      }

      // Add customProps to section config (optional)
      if (!empty($config['customProps']) && isset($pageData[$dataKey])) {
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
