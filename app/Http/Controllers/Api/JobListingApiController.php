<?php
// app/Http/Controllers/Api/JobListingApiController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class JobListingApiController extends Controller
{
  /**
   * Maximum items per page
   */
  private const MAX_PER_PAGE = 100;

  /**
   * Default items per page
   */
  private const DEFAULT_PER_PAGE = 15;

  /**
   * Get job listings with search and limit support
   * 
   * @param Request $request
   * @return JsonResponse
   * 
   * Query Parameters:
   * - search: Search by title, description, requirements, skills, keywords
   * - limit: Number of results to return (max 100)
   * - page: Page number for pagination
   * - per_page: Items per page (default 15, max 100)
   * - sort_by: Field to sort by (title, created_at, views_count, salary_min, salary_max)
   * - sort_order: asc or desc (default desc)
   * - job_type: Filter by job type (full-time, part-time, contract, internship, remote, hybrid)
   * - experience_level: Filter by experience level
   * - category_id: Filter by category ID
   * - location_id: Filter by location ID
   * - min_salary: Filter by minimum salary
   * - max_salary: Filter by maximum salary
   * - show_all: If true, returns all records (ignores pagination)
   */
  public function index(Request $request): JsonResponse
  {
    try {
      $query = JobListing::with(['category', 'locations', 'employer']);

      // Apply active filter by default (unless show_all is true)
      if (!$request->boolean('show_all')) {
        $query->active()->published();
      } elseif ($request->has('is_active')) {
        $query->where('is_active', $request->boolean('is_active'));
      }

      // Search functionality
      if ($request->filled('search')) {
        $searchTerm = $request->search;
        $query->search($searchTerm);
      }

      // Filter by job type
      if ($request->filled('job_type')) {
        $query->byJobType($request->job_type);
      }

      // Filter by multiple job types (comma separated)
      if ($request->filled('job_types')) {
        $types = array_filter(explode(',', $request->job_types));
        if (!empty($types)) {
          $query->whereIn('job_type', $types);
        }
      }

      // Filter by experience level
      if ($request->filled('experience_level')) {
        $query->where('experience_level', $request->experience_level);
      }

      // Filter by category
      if ($request->filled('category_id')) {
        $query->byCategory((int) $request->category_id);
      }

      // Filter by location
      if ($request->filled('location_id')) {
        $query->byLocation((int) $request->location_id);
      }

      // Filter by employer
      if ($request->filled('employer_id')) {
        $query->byEmployer((int) $request->employer_id);
      }

      // Salary range filters
      if ($request->filled('min_salary')) {
        $query->where('salary_min', '>=', (float) $request->min_salary);
      }
      if ($request->filled('max_salary')) {
        $query->where('salary_max', '<=', (float) $request->max_salary);
      }

      // Date range filters
      if ($request->filled('created_from')) {
        $query->where('created_at', '>=', $request->created_from);
      }
      if ($request->filled('created_to')) {
        $query->where('created_at', '<=', $request->created_to);
      }
      if ($request->filled('deadline_after')) {
        $query->where('application_deadline', '>=', $request->deadline_after);
      }
      if ($request->filled('deadline_before')) {
        $query->where('application_deadline', '<=', $request->deadline_before);
      }

      // Sorting
      $sortBy = $request->sort_by ?? 'created_at';
      $sortOrder = $request->sort_order ?? 'desc';

      $allowedSorts = ['id', 'title', 'created_at', 'updated_at', 'views_count', 'salary_min', 'salary_max', 'application_deadline'];
      if (in_array($sortBy, $allowedSorts) && in_array(strtolower($sortOrder), ['asc', 'desc'])) {
        $query->orderBy($sortBy, $sortOrder);
      } else {
        $query->orderBy('created_at', 'desc');
      }

      // Handle limit (returns all results up to limit)
      if ($request->has('limit')) {
        $limit = $this->sanitizeLimit($request->limit);
        $data = $query->limit($limit)->get();
        return $this->successResponse($data);
      }

      // Handle pagination
      if ($request->has('page')) {
        $perPage = $this->sanitizePerPage($request->per_page ?? self::DEFAULT_PER_PAGE);
        $data = $query->paginate($perPage);
        return $this->successResponse($data);
      }

      // Default: return paginated results
      $perPage = $this->sanitizePerPage($request->per_page ?? self::DEFAULT_PER_PAGE);
      $data = $query->paginate($perPage);

      return $this->successResponse($data);
    } catch (\Exception $e) {
      Log::error('JobListing API error: ' . $e->getMessage(), [
        'trace' => $e->getTraceAsString()
      ]);

      return $this->errorResponse('Failed to fetch job listings');
    }
  }

  /**
   * Get a single job listing by ID or slug
   * 
   * @param string $id
   * @param Request $request
   * @return JsonResponse
   */
  public function show(string $id, Request $request): JsonResponse
  {
    try {
      $query = JobListing::with(['category', 'locations', 'employer']);

      // If ID is numeric, find by ID, otherwise find by slug
      if (is_numeric($id)) {
        $job = $query->find($id);
      } else {
        $job = $query->where('slug', $id)->first();
      }

      if (!$job) {
        return $this->errorResponse('Job listing not found', 404);
      }

      // Increment view count
      if ($request->boolean('increment_view', true)) {
        $job->incrementViews();
      }

      return $this->successResponse($job);
    } catch (\Exception $e) {
      Log::error('JobListing show API error: ' . $e->getMessage());
      return $this->errorResponse('Failed to fetch job listing');
    }
  }

  /**
   * Sanitize and validate per page value
   */
  private function sanitizePerPage($value): int
  {
    $perPage = (int) $value;
    return min(max($perPage, 1), self::MAX_PER_PAGE);
  }

  /**
   * Sanitize and validate limit value
   */
  private function sanitizeLimit($value, int $max = 100): int
  {
    $limit = (int) $value;
    return min(max($limit, 1), $max);
  }

  /**
   * Return success response
   */
  private function successResponse($data, int $status = 200): JsonResponse
  {
    return response()->json([
      'success' => true,
      'data' => $data
    ], $status);
  }

  /**
   * Return error response
   */
  private function errorResponse(string $message, int $status = 500): JsonResponse
  {
    return response()->json([
      'success' => false,
      'message' => $message
    ], $status);
  }
}
