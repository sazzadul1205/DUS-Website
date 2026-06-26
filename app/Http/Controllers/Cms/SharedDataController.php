<?php
// app/Http/Controllers/Cms/SharedDataController.php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\pages\SharedData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

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
      'upcoming-events'
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
    $processedData = $this->processImages($request->data, $shared->data);

    $shared->update([
      'data' => $processedData,
      'is_active' => $request->is_active ?? true,
    ]);

    return redirect()->back()->with('success', 'Shared data updated successfully.');
  }

  /**
   * Process and upload images in the data array
   */
  protected function processImages(array $newData, array $oldData): array
  {
    // Recursively process the data array
    return $this->processArrayRecursive($newData, $oldData);
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
        // This is a base64 image - upload it
        $data[$key] = $this->uploadBase64Image($value, $key);
      }
    }

    return $data;
  }

  /**
   * Check if string is a base64 image
   */
  protected function isBase64Image(string $string): bool
  {
    // Check if it's a data URL
    if (str_starts_with($string, 'data:image/')) {
      return true;
    }
    return false;
  }

  /**
   * Upload base64 image and return the path
   */
  protected function uploadBase64Image(string $base64String, string $fieldName): string
  {
    try {
      // Extract the image data
      $imageData = explode(',', $base64String);
      $imageData = $imageData[1] ?? $base64String;

      // Decode the image
      $imageContent = base64_decode($imageData);

      // Generate a unique filename
      $extension = $this->getImageExtension($base64String);
      $filename = Str::uuid() . '.' . $extension;
      $path = 'uploads/shared/' . date('Y/m/d') . '/' . $filename;

      // Store the image
      Storage::disk('public')->put($path, $imageContent);

      // Return the public URL
      return '/storage/' . $path;
    } catch (\Exception $e) {
      // If upload fails, return the original string
      return $base64String;
    }
  }

  /**
   * Get image extension from base64 string
   */
  protected function getImageExtension(string $base64String): string
  {
    // Map MIME types to extensions
    $mimeMap = [
      'image/jpeg' => 'jpg',
      'image/png' => 'png',
      'image/gif' => 'gif',
      'image/webp' => 'webp',
      'image/svg+xml' => 'svg',
      'image/bmp' => 'bmp',
      'image/tiff' => 'tiff',
    ];

    // Extract MIME type from data URL
    if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $matches)) {
      $mimeType = 'image/' . $matches[1];
      return $mimeMap[$mimeType] ?? 'png';
    }

    return 'png';
  }

  /**
   * Delete old image if it exists and is not being used elsewhere
   */
  protected function deleteOldImage(string $oldPath): void
  {
    if (empty($oldPath)) {
      return;
    }

    // Remove storage prefix to get the actual path
    $path = str_replace('/storage/', '', $oldPath);

    if (Storage::disk('public')->exists($path)) {
      Storage::disk('public')->delete($path);
    }
  }
}
