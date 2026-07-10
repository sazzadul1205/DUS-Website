<?php
// app/Http/Controllers/Admin/CacheController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Frontend\SharedDataTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CacheController extends Controller
{
  use SharedDataTrait;

  /**
   * Clear all frontend cache
   */
  public function clearAll(Request $request)
  {
    // Optional: Add authorization check here
    // $this->authorize('manage-cache');

    $this->clearFrontendCache();

    // Clear page-specific caches
    $pages = ['home', 'about', 'contact', 'blog', 'blogs', 'projects-programs', 'publications', 'jobs'];
    foreach ($pages as $page) {
      Cache::forget('frontend_page_' . $page);
    }

    // Clear detail page caches
    $keys = Cache::get('frontend_cache_keys', []);
    foreach ($keys as $key) {
      if (
        str_starts_with($key, 'frontend_page_') ||
        str_starts_with($key, 'frontend_detail_') ||
        str_starts_with($key, 'frontend_custom_')
      ) {
        Cache::forget($key);
      }
    }

    Cache::forget('frontend_cache_keys');

    return response()->json([
      'success' => true,
      'message' => 'All frontend cache has been cleared.',
      'timestamp' => now()->toDateTimeString()
    ]);
  }

  /**
   * Clear cache for a specific page
   */
  public function clearPage(Request $request, string $pageSlug)
  {
    // Optional: Add authorization check here
    // $this->authorize('manage-cache');

    Cache::forget('frontend_page_' . $pageSlug);
    Cache::forget('frontend_custom_' . $pageSlug);

    return response()->json([
      'success' => true,
      'message' => "Cache for page '{$pageSlug}' has been cleared.",
      'timestamp' => now()->toDateTimeString()
    ]);
  }

  /**
   * Get cache status
   */
  public function status(Request $request)
  {
    $cacheStatus = [];

    // Check key caches
    $keys = [
      'frontend_shared_data' => 'Shared Data',
      'frontend_programs' => 'Programs',
      'frontend_blogs' => 'Blogs',
      'frontend_publications' => 'Publications',
      'frontend_jobs' => 'Jobs',
      'frontend_about_details' => 'About Details',
    ];

    foreach ($keys as $key => $label) {
      $cacheStatus[] = [
        'key' => $key,
        'label' => $label,
        'exists' => Cache::has($key),
      ];
    }

    return response()->json([
      'success' => true,
      'cache_status' => $cacheStatus,
      'timestamp' => now()->toDateTimeString()
    ]);
  }
}
