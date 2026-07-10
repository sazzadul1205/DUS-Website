<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Existing inspire command
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ============================================
// FRONTEND CACHE SCHEDULING
// ============================================

// Clear frontend cache daily at 2:00 AM (low traffic time)
Schedule::command('frontend:clear-cache --all')
    ->dailyAt('02:00')
    ->description('Clear frontend cache to refresh data');

// Optional: Clear cache on Sundays at 3:00 AM (weekly full refresh)
Schedule::command('frontend:clear-cache --all')
    ->weekly()
    ->sundays()
    ->at('03:00')
    ->description('Weekly full frontend cache refresh');

// Optional: Keep cache warm by visiting home page after clearing
Schedule::call(function () {
    try {
        // Warm up the home page cache
        \Illuminate\Support\Facades\Http::timeout(5)->get(config('app.url') . '/');
        \Illuminate\Support\Facades\Log::info('Cache warmup completed for home page');
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::warning('Cache warmup failed: ' . $e->getMessage());
    }
})->dailyAt('02:05')->description('Warm up cache after clearing');

// Clear cache if memory usage is high (optional)
Schedule::call(function () {
    $memoryUsage = memory_get_usage(true) / 1024 / 1024; // MB
    if ($memoryUsage > 200) { // If memory usage > 200MB
        Artisan::call('frontend:clear-cache --all --quiet');
        \Illuminate\Support\Facades\Log::info('Cache auto-cleared due to high memory usage: ' . round($memoryUsage, 2) . 'MB');
    }
})->everyThirtyMinutes();

// Optional: Clear cache at midnight if you have a lot of content updates
Schedule::command('frontend:clear-cache --all')
    ->daily()
    ->at('00:00')
    ->description('Midnight cache refresh');

// Optional: Clear specific pages if needed (like blog pages)
Schedule::command('frontend:clear-cache --page=home')
    ->dailyAt('04:00')
    ->description('Refresh home page cache');

Schedule::command('frontend:clear-cache --page=blog')
    ->dailyAt('04:30')
    ->description('Refresh blog page cache');

// ============================================
// DATABASE BACKUP SCHEDULING (Optional)
// ============================================

// Create database backup daily at 1:00 AM
// Schedule::command('backup:run')->dailyAt('01:00');

// ============================================
// SESSION CLEANUP (Optional)
// ============================================

// Clean expired sessions daily
// Schedule::command('session:clean')->daily();

// ============================================
// EMAIL QUEUE PROCESSING (Optional)
// ============================================

// Process email queue every 5 minutes
// Schedule::command('queue:work --queue=emails --stop-when-empty')->everyFiveMinutes();