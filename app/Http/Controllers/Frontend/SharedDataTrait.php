<?php
// app/Http/Controllers/Frontend/SharedDataTrait.php

namespace App\Http\Controllers\Frontend;

use App\Models\pages\SharedData;
use Illuminate\Support\Facades\Cache;

trait SharedDataTrait
{
  /**
   * Cache duration in seconds (24 hours)
   */
  protected function getCacheDuration(): int
  {
    return 86400; // 24 hours
  }

  /**
   * Get shared data for all frontend pages (TopBar, Navbar, Footer, Stories)
   * with caching
   */
  public function getSharedData(): array
  {
    $cacheKey = 'frontend_shared_data';
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Try to get from cache
    $sharedData = Cache::remember($cacheKey, $this->getCacheDuration(), function () use ($asset) {
      return $this->fetchSharedData($asset);
    });

    return $sharedData;
  }

  /**
   * Fetch shared data from database
   */
  private function fetchSharedData(callable $asset): array
  {
    $sharedTypes = [
      'topbar' => 'topbarData',
      'navbar' => 'navbarData',
      'footer' => 'footerData',
      'stories' => 'storiesData',
    ];

    $sharedData = [];

    foreach ($sharedTypes as $type => $key) {
      $record = SharedData::where('type', $type)
        ->where('is_active', true)
        ->first();

      $sharedData[$key] = $record ? $this->transformAssetUrls($record->data ?? [], $asset) : [];
    }

    return $sharedData;
  }

  /**
   * Clear all frontend cache
   */
  public function clearFrontendCache(): void
  {
    Cache::forget('frontend_shared_data');
    Cache::forget('frontend_page_data');
    Cache::forget('frontend_section_data');
    Cache::forget('frontend_programs');
    Cache::forget('frontend_blogs');
    Cache::forget('frontend_publications');
    Cache::forget('frontend_jobs');
    Cache::forget('frontend_about_details');
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
   * Check if cache is valid or needs refresh
   */
  public function isCacheValid(string $key): bool
  {
    return Cache::has($key);
  }

  /**
   * Get cache timestamp for a specific key
   */
  public function getCacheTimestamp(string $key): ?int
  {
    if (Cache::has($key)) {
      // Laravel doesn't provide direct timestamp retrieval, but we can track it
      $timestampKey = $key . '_timestamp';
      return Cache::get($timestampKey);
    }
    return null;
  }
}
