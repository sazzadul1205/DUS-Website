<?php
// app/Console/Commands/ClearFrontendCache.php

namespace App\Console\Commands;

use App\Http\Controllers\Frontend\PageController;
use App\Http\Controllers\Frontend\SharedDataTrait;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ClearFrontendCache extends Command
{
  use SharedDataTrait;

  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'frontend:clear-cache {--page= : Clear cache for a specific page} {--all : Clear all frontend cache}';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Clear frontend cache to force fresh data fetching';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    if ($this->option('all')) {
      $this->clearAllFrontendCache();
      $this->info('✅ All frontend cache has been cleared.');
      return;
    }

    if ($this->option('page')) {
      $pageSlug = $this->option('page');
      $this->clearPageCache($pageSlug);
      $this->info("✅ Cache for page '{$pageSlug}' has been cleared.");
      return;
    }

    // Default: clear all
    $this->clearAllFrontendCache();
    $this->info('✅ All frontend cache has been cleared.');
  }

  /**
   * Clear all frontend cache
   */
  private function clearAllFrontendCache(): void
  {
    $this->clearFrontendCache();

    // Clear page-specific caches
    $pages = ['home', 'about', 'contact', 'blog', 'blogs', 'projects-programs', 'publications', 'jobs'];
    foreach ($pages as $page) {
      Cache::forget('frontend_page_' . $page);
    }

    // Clear detail page caches (pattern matching)
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
  }

  /**
   * Clear cache for a specific page
   */
  private function clearPageCache(string $pageSlug): void
  {
    $controller = new PageController(app(\App\Services\ContentService::class));
    $controller->clearPageCache($pageSlug);
  }
}
