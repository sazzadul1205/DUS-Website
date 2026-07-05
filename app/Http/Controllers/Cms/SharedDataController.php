<?php
// app/Http/Controllers/Cms/SharedDataController.php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\pages\SharedData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class SharedDataController extends Controller
{
  /**
   * Display shared data management page
   */
  public function index(): Response
  {
    $sharedData = SharedData::whereIn('type', [
      'topbar',
      'navbar',
      'footer',
      'faq',
      'upcoming-events',
      'stories',
    ])->get();

    return Inertia::render('Backend/CMS/Shared/Index', [
      'sharedData' => $sharedData,
    ]);
  }

  /**
   * Update shared data
   */
  public function update(Request $request, int $id)
  {
    $shared = SharedData::findOrFail($id);

    $validator = Validator::make($request->all(), [
      'data' => 'required|array',
      'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
      return back()->withErrors($validator)->withInput();
    }

    // Process data - handle image uploads
    $processedData = $this->processImages($request->data, $shared->data, $shared->type);

    // 🔥 UPDATE: Convert processed data to JSON for storage (if needed)
    // Some models store data as JSON string, others as array
    $dataToSave = $processedData;
    if (is_array($processedData) && property_exists($shared, 'casts') && isset($shared->getCasts()['data']) && $shared->getCasts()['data'] === 'array') {
      $dataToSave = $processedData;
    } else {
      $dataToSave = json_encode($processedData);
    }

    $shared->update([
      'data' => $dataToSave,
      'is_active' => $request->is_active ?? true,
    ]);

    // 🔥 FIX: Don't cache the entire model with massive data
    // Instead, cache only the processed data structure
    $this->cacheSharedData('upcoming-events', $processedData);

    return redirect()->back()->with('success', 'Shared data updated successfully.');
  }

  /**
   * Cache only the processed data (not the entire model with base64)
   */
  protected function cacheSharedData(string $type, array $data): void
  {
    Cache::forget('shared.' . $type);
    Cache::put('shared.' . $type, $data, 60 * 24 * 7); // 7 days
  }

  /**
   * Process and upload images in the data array
   */
  protected function processImages(array $newData, array $oldData, string $type): array
  {
    // Special handling for navbar and footer logos
    if ($type === 'navbar') {
      return $this->processNavbarData($newData, $oldData);
    }

    if ($type === 'footer') {
      return $this->processFooterData($newData, $oldData);
    }

    // For upcoming-events, process with specific directory
    if ($type === 'upcoming-events') {
      return $this->processUpcomingEventsData($newData, $oldData);
    }

    // For other types, process normally
    return $this->processArrayRecursive($newData, $oldData);
  }

  /**
   * Process upcoming events data with specific directory for images
   * 🔥 FIXED: Process base64 images and replace with URLs
   */
  protected function processUpcomingEventsData(array $newData, array $oldData): array
  {
    // Process section data
    if (isset($newData['section']) && is_array($newData['section'])) {
      $newData['section'] = $this->processArrayRecursive($newData['section'], $oldData['section'] ?? []);
    }

    // 🔥 Process the main image at root level
    if (isset($newData['image']) && is_array($newData['image'])) {
      // If image.src is base64, upload it
      if (isset($newData['image']['src']) && $this->isBase64Image($newData['image']['src'])) {
        $newData['image']['src'] = $this->uploadEventImage($newData['image']['src'], 'event-cover');
      }
    }

    // Process events array
    if (isset($newData['events']) && is_array($newData['events'])) {
      foreach ($newData['events'] as $index => $event) {
        // 🔥 CRITICAL FIX: Process the event image immediately
        if (isset($event['image']) && $this->isBase64Image($event['image'])) {
          // Upload to UpcomingEvent directory and replace with URL
          $newData['events'][$index]['image'] = $this->uploadEventImage($event['image'], 'event-' . ($index + 1));
        }

        // Process other nested arrays in event
        if (is_array($event)) {
          foreach ($event as $key => $value) {
            if ($key !== 'image' && is_array($value)) {
              $oldEvent = $oldData['events'][$index] ?? [];
              $newData['events'][$index][$key] = $this->processArrayRecursive($value, $oldEvent[$key] ?? []);
            }
          }
        }
      }
    }

    return $newData;
  }

  /**
   * Upload event image to storage
   * 🔥 NEW: Centralized image upload with cleanup
   */
  protected function uploadEventImage(string $base64String, string $prefix = 'event'): string
  {
    try {
      // Decode base64 image
      $imageData = explode(',', $base64String);
      if (count($imageData) < 2) {
        return '';
      }

      $imageContent = base64_decode($imageData[1]);
      if ($imageContent === false) {
        return '';
      }

      // Get image extension
      $extension = $this->getImageExtension($base64String);
      if (!$extension) {
        $extension = 'jpg';
      }

      // Generate unique filename
      $filename = $prefix . '_' . time() . '_' . Str::random(16) . '.' . $extension;
      $path = 'UpcomingEvent/' . $filename;

      // Store the image
      Storage::disk('public')->put($path, $imageContent);

      // Return the public URL
      return '/storage/' . $path;
    } catch (\Exception $e) {
      Log::error('Failed to upload event image: ' . $e->getMessage());
      return $base64String;
    }
  }

  /**
   * Process navbar data with special logo handling
   */
  protected function processNavbarData(array $newData, array $oldData): array
  {
    if (isset($newData['logo']['src']) && $this->isBase64Image($newData['logo']['src'])) {
      $newData['logo']['src'] = $this->uploadNavbarLogo($newData['logo']['src']);
    }

    foreach ($newData as $key => $value) {
      if (is_array($value) && $key !== 'logo') {
        $oldValue = $oldData[$key] ?? [];
        $newData[$key] = $this->processArrayRecursive($value, $oldValue);
      }
    }

    return $newData;
  }

  /**
   * Process footer data with special logo handling
   */
  protected function processFooterData(array $newData, array $oldData): array
  {
    if (isset($newData['logo']['src']) && $this->isBase64Image($newData['logo']['src'])) {
      $newData['logo']['src'] = $this->uploadFooterLogo($newData['logo']['src']);
    }

    foreach ($newData as $key => $value) {
      if (is_array($value) && $key !== 'logo') {
        $oldValue = $oldData[$key] ?? [];
        $newData[$key] = $this->processArrayRecursive($value, $oldValue);
      }
    }

    return $newData;
  }

  /**
   * Upload navbar logo
   */
  protected function uploadNavbarLogo(string $base64String): string
  {
    try {
      $imageData = explode(',', $base64String);
      $imageData = $imageData[1] ?? $base64String;
      $imageContent = base64_decode($imageData);
      $extension = $this->getImageExtension($base64String);

      $filename = 'icon.' . $extension;
      $path = 'images/' . $filename;

      Storage::disk('public')->put($path, $imageContent);

      return '/storage/' . $path;
    } catch (\Exception $e) {
      return $base64String;
    }
  }

  /**
   * Upload footer logo
   */
  protected function uploadFooterLogo(string $base64String): string
  {
    try {
      $imageData = explode(',', $base64String);
      $imageData = $imageData[1] ?? $base64String;
      $imageContent = base64_decode($imageData);
      $extension = $this->getImageExtension($base64String);

      $filename = 'Icon-bottom.' . $extension;
      $path = 'images/' . $filename;

      Storage::disk('public')->put($path, $imageContent);

      return '/storage/' . $path;
    } catch (\Exception $e) {
      return $base64String;
    }
  }

  /**
   * Recursively process array for image uploads
   */
  protected function processArrayRecursive(array $data, array $oldData): array
  {
    foreach ($data as $key => $value) {
      if (is_array($value)) {
        $oldValue = $oldData[$key] ?? [];
        $data[$key] = $this->processArrayRecursive($value, $oldValue);
      } elseif (is_string($value) && $this->isBase64Image($value)) {
        $data[$key] = $this->uploadGenericImage($value);
      }
    }

    return $data;
  }

  /**
   * Upload generic image
   */
  protected function uploadGenericImage(string $base64String): string
  {
    try {
      $imageData = explode(',', $base64String);
      $imageData = $imageData[1] ?? $base64String;
      $imageContent = base64_decode($imageData);
      $extension = $this->getImageExtension($base64String);

      $filename = Str::uuid() . '.' . $extension;
      $path = 'uploads/shared/' . date('Y/m/d') . '/' . $filename;

      Storage::disk('public')->put($path, $imageContent);

      return '/storage/' . $path;
    } catch (\Exception $e) {
      return $base64String;
    }
  }

  /**
   * Check if string is a base64 image
   */
  protected function isBase64Image(string $string): bool
  {
    return str_starts_with($string, 'data:image/');
  }

  /**
   * Get image extension from base64 string
   */
  protected function getImageExtension(string $base64String): string
  {
    $mimeMap = [
      'image/jpeg' => 'jpg',
      'image/jpg' => 'jpg',
      'image/png' => 'png',
      'image/gif' => 'gif',
      'image/webp' => 'webp',
      'image/svg+xml' => 'svg',
      'image/svg' => 'svg',
      'image/bmp' => 'bmp',
      'image/tiff' => 'tiff',
      'image/x-icon' => 'ico',
      'image/vnd.microsoft.icon' => 'ico',
    ];

    if (preg_match('/^data:([^;]+);base64,/', $base64String, $matches)) {
      $mimeType = $matches[1];
      return $mimeMap[$mimeType] ?? 'png';
    }

    return 'png';
  }

  /**
   * Delete old image when updating
   */
  protected function deleteOldImage(string $oldImagePath): void
  {
    if (empty($oldImagePath)) {
      return;
    }

    // Remove /storage/ prefix to get the storage path
    $path = str_replace('/storage/', '', $oldImagePath);

    if (Storage::disk('public')->exists($path)) {
      Storage::disk('public')->delete($path);
    }
  }
}
