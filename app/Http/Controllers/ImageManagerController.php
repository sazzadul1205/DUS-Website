<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ImageManagerController extends Controller
{
  /**
   * The fixed path where images will be stored
   */
  protected string $imagePath;

  /**
   * The path for icons
   */
  protected string $iconPath;

  public function __construct()
  {
    // Fixed path for general images
    $this->imagePath = storage_path('app/public/images/managed');

    // Fixed path for icons (public directory so they're accessible)
    $this->iconPath = public_path('images');

    // Ensure directories exist
    if (!File::exists($this->imagePath)) {
      File::makeDirectory($this->imagePath, 0755, true);
    }
    if (!File::exists($this->iconPath)) {
      File::makeDirectory($this->iconPath, 0755, true);
    }
  }

  /**
   * Display the icon management page
   */
  public function index(): Response
  {
    $currentIcon = $this->getCurrentIcon();

    return Inertia::render('Backend/IconManager/Index', [
      'currentIcon' => $currentIcon,
      'icons' => $this->getAvailableIcons(),
    ]);
  }

  /**
   * Update the site icon
   */
  public function updateIcon(Request $request): JsonResponse
  {
    try {
      $request->validate([
        'icon' => 'required|file|image|max:2048', // 2MB max
      ]);

      $file = $request->file('icon');
      $extension = $file->getClientOriginalExtension();

      // Allowed extensions
      $allowed = ['png', 'ico', 'jpg', 'jpeg', 'svg', 'webp'];
      if (!in_array(strtolower($extension), $allowed)) {
        return response()->json([
          'success' => false,
          'message' => 'Invalid file type. Allowed: ' . implode(', ', $allowed),
        ], 422);
      }

      // Delete old icon files
      $this->deleteOldIcons();

      // Generate new filename
      $filename = 'icon.' . $extension;

      // If it's an SVG, keep it as SVG, otherwise convert to PNG and ICO
      if ($extension === 'svg') {
        $file->move($this->iconPath, $filename);
      } else {
        // Save as PNG
        $pngFilename = 'icon.png';
        $file->move($this->iconPath, $pngFilename);

        // Try to create ICO version if GD is available
        if (extension_loaded('gd')) {
          try {
            $this->convertToIco($this->iconPath . '/' . $pngFilename, $this->iconPath . '/icon.ico');
          } catch (\Exception $e) {
            // ICO conversion failed, but PNG is still available
          }
        }
      }

      return response()->json([
        'success' => true,
        'message' => 'Icon updated successfully!',
        'data' => [
          'icon' => asset('images/' . $filename),
        ],
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to update icon: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Reset icon to default
   */
  public function resetIcon(): JsonResponse
  {
    try {
      $this->deleteOldIcons();

      return response()->json([
        'success' => true,
        'message' => 'Icon reset to default successfully!',
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to reset icon: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Get current icon info
   */
  protected function getCurrentIcon(): ?array
  {
    $iconFiles = ['icon.png', 'icon.ico', 'icon.svg', 'icon.jpg', 'icon.jpeg', 'icon.webp'];

    foreach ($iconFiles as $file) {
      $path = $this->iconPath . '/' . $file;
      if (File::exists($path)) {
        return [
          'name' => $file,
          'url' => asset('images/' . $file),
          'size' => $this->formatBytes(File::size($path)),
          'last_modified' => date('Y-m-d H:i:s', File::lastModified($path)),
        ];
      }
    }

    return null;
  }

  /**
   * Get available icons in the directory
   */
  protected function getAvailableIcons(): array
  {
    $files = File::files($this->iconPath);
    $icons = [];

    foreach ($files as $file) {
      $name = $file->getFilename();
      // Only show icon files
      if (str_starts_with($name, 'icon.')) {
        $icons[] = [
          'name' => $name,
          'url' => asset('images/' . $name),
          'size' => $this->formatBytes($file->getSize()),
          'extension' => $file->getExtension(),
        ];
      }
    }

    return $icons;
  }

  /**
   * Delete all old icon files
   */
  protected function deleteOldIcons(): void
  {
    $iconFiles = ['icon.png', 'icon.ico', 'icon.svg', 'icon.jpg', 'icon.jpeg', 'icon.webp', 'icon.gif'];

    foreach ($iconFiles as $file) {
      $path = $this->iconPath . '/' . $file;
      if (File::exists($path)) {
        File::delete($path);
      }
    }
  }

  /**
   * Convert PNG to ICO
   */
  protected function convertToIco(string $pngPath, string $icoPath): void
  {
    if (!extension_loaded('gd')) {
      throw new \Exception('GD extension is required for ICO conversion');
    }

    $image = imagecreatefrompng($pngPath);
    if (!$image) {
      throw new \Exception('Failed to create image from PNG');
    }

    // Save as ICO
    imagealphablending($image, true);
    imagesavealpha($image, true);

    // Create ICO file using a simple method
    // Note: This is a basic ICO converter, for production use a proper library
    $this->saveIco($image, $icoPath);

    imagedestroy($image);
  }

  /**
   * Simple ICO file creator
   */
  protected function saveIco($image, string $path): void
  {
    $width = imagesx($image);
    $height = imagesy($image);

    // Prepare ICO header (simplified)
    $header = pack('vvv', 0, 1, 1);

    // Image data
    ob_start();
    imagepng($image);
    $pngData = ob_get_clean();

    // Write ICO file (simplified - for production use a proper library)
    file_put_contents($path, $header . $pngData);
  }

  /**
   * Format bytes
   */
  protected function formatBytes(int $bytes): string
  {
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = 0;
    while ($bytes >= 1024 && $i < count($units) - 1) {
      $bytes /= 1024;
      $i++;
    }
    return round($bytes, 2) . ' ' . $units[$i];
  }
}
