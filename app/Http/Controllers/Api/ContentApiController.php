<?php
// app/Http/Controllers/Api/ContentApiController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentApiController extends Controller
{
  /**
   * Get pages with query parameters
   */
  public function pages(Request $request): JsonResponse
  {
    $query = DB::table('pages')->where('is_active', 1)
      ->select('id', 'slug', 'name', 'title', 'description', 'is_active', 'created_at', 'updated_at');

    if ($request->has('slug')) {
      $query->where('slug', $request->slug);
    }

    if ($request->has('slugs')) {
      $slugs = explode(',', $request->slugs);
      $query->whereIn('slug', $slugs);
    }

    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('name', 'like', $search)
          ->orWhere('title', 'like', $search)
          ->orWhere('description', 'like', $search);
      });
    }

    $sortBy = $request->sort_by ?? 'id';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'slug', 'name', 'title', 'created_at', 'updated_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    $perPage = $request->per_page ?? 15;
    $perPage = min(max($perPage, 1), 100);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get section configs with query parameters
   */
  public function sectionConfigs(Request $request): JsonResponse
  {
    $query = DB::table('section_configs')
      ->where('is_enabled', 1)
      ->orderBy('display_order');

    if ($request->has('page_slug')) {
      $query->where('page_slug', $request->page_slug);
    }

    if ($request->has('component')) {
      $query->where('component', $request->component);
    }

    if ($request->has('components')) {
      $components = explode(',', $request->components);
      $query->whereIn('component', $components);
    }

    if ($request->has('data_table')) {
      $query->where('data_table', $request->data_table);
    }

    if ($request->has('is_fixed_section')) {
      $query->where('is_fixed_section', (int) $request->is_fixed_section);
    }

    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('component', 'like', $search)
          ->orWhere('data_key', 'like', $search)
          ->orWhere('section_key', 'like', $search);
      });
    }

    if ($request->has('display_order_min')) {
      $query->where('display_order', '>=', (int) $request->display_order_min);
    }
    if ($request->has('display_order_max')) {
      $query->where('display_order', '<=', (int) $request->display_order_max);
    }

    $sortBy = $request->sort_by ?? 'display_order';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'display_order', 'component', 'page_slug', 'created_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    $perPage = $request->per_page ?? 50;
    $perPage = min(max($perPage, 1), 200);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get shared data with query parameters
   */
  public function sharedData(Request $request): JsonResponse
  {
    $query = DB::table('shared_data')->where('is_active', 1);

    if ($request->has('type')) {
      $query->where('type', $request->type);
    }

    if ($request->has('types')) {
      $types = explode(',', $request->types);
      $query->whereIn('type', $types);
    }

    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('type', 'like', $search)
          ->orWhere('data', 'like', $search);
      });
    }

    if ($request->has('json_search')) {
      $search = '%' . $request->json_search . '%';
      $query->where('data', 'like', $search);
    }

    $sortBy = $request->sort_by ?? 'type';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'type', 'created_at', 'updated_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    $perPage = $request->per_page ?? 50;
    $perPage = min(max($perPage, 1), 200);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get custom section data with query parameters
   */
  public function customSectionData(Request $request): JsonResponse
  {
    $query = DB::table('custom_section_data')->where('is_active', 1);

    if ($request->has('page_slug')) {
      $query->where('page_slug', $request->page_slug);
    }

    if ($request->has('section_key')) {
      $query->where('section_key', $request->section_key);
    }

    if ($request->has('section_keys')) {
      $keys = explode(',', $request->section_keys);
      $query->whereIn('section_key', $keys);
    }

    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('section_key', 'like', $search)
          ->orWhere('data', 'like', $search);
      });
    }

    if ($request->has('is_active')) {
      $query->where('is_active', (int) $request->is_active);
    }

    $sortBy = $request->sort_by ?? 'id';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'page_slug', 'section_key', 'is_active', 'created_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    $perPage = $request->per_page ?? 50;
    $perPage = min(max($perPage, 1), 200);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get programs with query parameters
   */
  public function programs(Request $request): JsonResponse
  {
    $query = DB::table('programs')->where('is_active', 1);

    if ($request->has('slug')) {
      $query->where('slug', $request->slug);
    }

    if ($request->has('slugs')) {
      $slugs = explode(',', $request->slugs);
      $query->whereIn('slug', $slugs);
    }

    if ($request->has('is_featured')) {
      $query->where('is_featured', (int) $request->is_featured);
    }

    if ($request->has('category')) {
      $query->where('category', $request->category);
    }

    if ($request->has('categories')) {
      $categories = explode(',', $request->categories);
      $query->whereIn('category', $categories);
    }

    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', $search)
          ->orWhere('description', 'like', $search)
          ->orWhere('content', 'like', $search);
      });
    }

    if ($request->has('display_order_min')) {
      $query->where('display_order', '>=', (int) $request->display_order_min);
    }
    if ($request->has('display_order_max')) {
      $query->where('display_order', '<=', (int) $request->display_order_max);
    }

    if ($request->has('created_from')) {
      $query->where('created_at', '>=', $request->created_from);
    }
    if ($request->has('created_to')) {
      $query->where('created_at', '<=', $request->created_to);
    }

    $sortBy = $request->sort_by ?? 'display_order';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'title', 'display_order', 'is_featured', 'created_at', 'updated_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    if ($request->has('limit')) {
      $limit = (int) $request->limit;
      $limit = min(max($limit, 1), 100);
      $query->limit($limit);
    }

    $perPage = $request->per_page ?? 15;
    $perPage = min(max($perPage, 1), 100);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get blogs with query parameters
   */
  public function blogs(Request $request): JsonResponse
  {
    $query = DB::table('blogs')->where('is_active', 1);

    if ($request->has('slug')) {
      $query->where('slug', $request->slug);
    }

    if ($request->has('slugs')) {
      $slugs = explode(',', $request->slugs);
      $query->whereIn('slug', $slugs);
    }

    if ($request->has('is_featured')) {
      $query->where('is_featured', (int) $request->is_featured);
    }

    if ($request->has('author')) {
      $query->where('author', 'like', '%' . $request->author . '%');
    }

    if ($request->has('category')) {
      $query->where('category', $request->category);
    }

    if ($request->has('categories')) {
      $categories = explode(',', $request->categories);
      $query->whereIn('category', $categories);
    }

    if ($request->has('tag')) {
      $query->where('tags', 'like', '%"' . $request->tag . '"%')
        ->orWhere('tags', 'like', '%' . $request->tag . '%');
    }

    if ($request->has('tags')) {
      $tags = explode(',', $request->tags);
      $query->where(function ($q) use ($tags) {
        foreach ($tags as $tag) {
          $q->orWhere('tags', 'like', '%"' . trim($tag) . '"%')
            ->orWhere('tags', 'like', '%' . trim($tag) . '%');
        }
      });
    }

    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', $search)
          ->orWhere('excerpt', 'like', $search)
          ->orWhere('content', 'like', $search)
          ->orWhere('full_content', 'like', $search);
      });
    }

    if ($request->has('created_from')) {
      $query->where('created_at', '>=', $request->created_from);
    }
    if ($request->has('created_to')) {
      $query->where('created_at', '<=', $request->created_to);
    }

    if ($request->has('published_from')) {
      $query->where('published_at', '>=', $request->published_from);
    }
    if ($request->has('published_to')) {
      $query->where('published_at', '<=', $request->published_to);
    }

    $sortBy = $request->sort_by ?? 'created_at';
    $sortOrder = $request->sort_order ?? 'desc';
    $allowedSorts = ['id', 'title', 'author', 'is_featured', 'created_at', 'updated_at', 'published_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    if ($request->has('limit')) {
      $limit = (int) $request->limit;
      $limit = min(max($limit, 1), 100);
      $query->limit($limit);
    }

    $perPage = $request->per_page ?? 15;
    $perPage = min(max($perPage, 1), 100);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get about content with query parameters
   */
  public function aboutContent(Request $request): JsonResponse
  {
    $query = DB::table('about_content')->where('is_active', 1);

    if ($request->has('slug')) {
      $query->where('slug', $request->slug);
    }

    if ($request->has('slugs')) {
      $slugs = explode(',', $request->slugs);
      $query->whereIn('slug', $slugs);
    }

    if ($request->has('search')) {
      $search = '%' . $request->search . '%';
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', $search)
          ->orWhere('content', 'like', $search)
          ->orWhere('full_content', 'like', $search);
      });
    }

    if ($request->has('display_order_min')) {
      $query->where('display_order', '>=', (int) $request->display_order_min);
    }
    if ($request->has('display_order_max')) {
      $query->where('display_order', '<=', (int) $request->display_order_max);
    }

    $sortBy = $request->sort_by ?? 'display_order';
    $sortOrder = $request->sort_order ?? 'asc';
    $allowedSorts = ['id', 'title', 'slug', 'display_order', 'created_at', 'updated_at'];

    if (in_array($sortBy, $allowedSorts)) {
      $query->orderBy($sortBy, $sortOrder);
    }

    if ($request->has('limit')) {
      $limit = (int) $request->limit;
      $limit = min(max($limit, 1), 100);
      $query->limit($limit);
    }

    $perPage = $request->per_page ?? 15;
    $perPage = min(max($perPage, 1), 100);

    if ($request->has('page')) {
      $data = $query->paginate($perPage);
    } else {
      $data = $query->get();
    }

    return response()->json(['data' => $data]);
  }

  /**
   * Get jobs with query parameters
   * Returns 5 most viewed jobs by default
   */
  public function jobs(Request $request): JsonResponse
  {
    try {
      $query = DB::table('job_listings')->where('is_active', 1);

      // Filtering
      if ($request->has('slug')) {
        $query->where('slug', $request->slug);
      }

      if ($request->has('type')) {
        $query->where('job_type', $request->type);
      }

      if ($request->has('types')) {
        $types = explode(',', $request->types);
        $query->whereIn('job_type', $types);
      }

      if ($request->has('department')) {
        $query->where('department', 'like', '%' . $request->department . '%');
      }

      if ($request->has('location')) {
        $query->where('location', 'like', '%' . $request->location . '%');
      }

      if ($request->has('min_views')) {
        $query->where('views_count', '>=', (int) $request->min_views);
      }

      if ($request->has('max_views')) {
        $query->where('views_count', '<=', (int) $request->max_views);
      }

      if ($request->has('created_from')) {
        $query->where('created_at', '>=', $request->created_from);
      }
      if ($request->has('created_to')) {
        $query->where('created_at', '<=', $request->created_to);
      }

      if ($request->has('deadline_before')) {
        $query->where('application_deadline', '<=', $request->deadline_before);
      }
      if ($request->has('deadline_after')) {
        $query->where('application_deadline', '>=', $request->deadline_after);
      }

      if ($request->has('is_active')) {
        $query->where('is_active', (int) $request->is_active);
      }

      if ($request->has('category_id')) {
        $query->where('category_id', (int) $request->category_id);
      }

      if ($request->has('experience_level')) {
        $query->where('experience_level', $request->experience_level);
      }

      if ($request->has('salary_min')) {
        $query->where('salary_min', '>=', (float) $request->salary_min);
      }
      if ($request->has('salary_max')) {
        $query->where('salary_max', '<=', (float) $request->salary_max);
      }

      if ($request->has('is_salary_negotiable')) {
        $query->where('is_salary_negotiable', (int) $request->is_salary_negotiable);
      }

      // Searching
      if ($request->has('search')) {
        $search = '%' . $request->search . '%';
        $query->where(function ($q) use ($search) {
          $q->where('title', 'like', $search)
            ->orWhere('description', 'like', $search)
            ->orWhere('requirements', 'like', $search);
        });
      }

      if ($request->has('keyword_search')) {
        $search = '%' . $request->keyword_search . '%';
        $query->where(function ($q) use ($search) {
          $q->where('keywords', 'like', $search)
            ->orWhereJsonContains('keywords', $request->keyword_search);
        });
      }

      if ($request->has('skill_search')) {
        $query->whereJsonContains('skills', $request->skill_search);
      }

      // Sorting - Default: Most Viewed
      $sortBy = $request->sort_by ?? 'views_count';
      $sortOrder = $request->sort_order ?? 'desc';
      $allowedSorts = ['id', 'title', 'job_type', 'views_count', 'created_at', 'updated_at', 'application_deadline', 'salary_min', 'salary_max', 'is_active', 'category_id', 'experience_level'];

      if (in_array($sortBy, $allowedSorts)) {
        $query->orderBy($sortBy, $sortOrder);
      }

      // Most viewed override
      if ($request->has('most_viewed')) {
        $limit = (int) $request->most_viewed;
        $limit = min(max($limit, 1), 20);
        $query->orderBy('views_count', 'desc')->limit($limit);
      }

      // Latest override
      if ($request->has('latest')) {
        $limit = (int) $request->latest;
        $limit = min(max($limit, 1), 20);
        $query->orderBy('created_at', 'desc')->limit($limit);
      }

      // Limit - Default: 5
      $defaultLimit = $request->has('page') ? null : 5;
      $limit = $request->has('limit') ? (int) $request->limit : $defaultLimit;

      if ($limit !== null) {
        $limit = min(max($limit, 1), 100);
        $query->limit($limit);
      }

      // Get data
      $data = $query->get();

      // Format for React
      if ($request->has('format') && $request->format === 'react') {
        $data = $data->map(function ($job) {
          return [
            'id' => $job->id,
            'type' => $this->formatJobType($job->job_type),
            'department' => $this->getDepartmentFromTitle($job->title),
            'location' => $job->location ?? 'Bangladesh',
            'title' => $job->title,
            'description' => $job->description ?? 'No description available.',
            'link' => "/jobs/{$job->slug}",
            'views' => $job->views_count ?? 0,
            'slug' => $job->slug,
            'is_active' => $job->is_active ?? true,
          ];
        });
      }

      // Pagination
      if ($request->has('page')) {
        $perPage = $request->per_page ?? 15;
        $perPage = min(max($perPage, 1), 100);
        $paginated = $query->paginate($perPage);

        if ($request->has('format') && $request->format === 'react') {
          $paginated->getCollection()->transform(function ($job) {
            return [
              'id' => $job->id,
              'type' => $this->formatJobType($job->job_type),
              'department' => $this->getDepartmentFromTitle($job->title),
              'location' => $job->location ?? 'Bangladesh',
              'title' => $job->title,
              'description' => $job->description ?? 'No description available.',
              'link' => "/jobs/{$job->slug}",
              'views' => $job->views_count ?? 0,
              'slug' => $job->slug,
              'is_active' => $job->is_active ?? true,
            ];
          });
        }

        return response()->json(['data' => $paginated]);
      }

      return response()->json(['data' => $data]);
    } catch (\Exception $e) {
      return response()->json(['data' => [], 'error' => $e->getMessage()], 500);
    }
  }

  /**
   * Format job type to match React's expected format
   */
  private function formatJobType(?string $type): string
  {
    if (!$type) return 'Full time';

    $mapping = [
      'full-time' => 'Full time',
      'part-time' => 'Part time',
      'contract' => 'Contract',
      'internship' => 'Internship',
      'remote' => 'Remote',
      'hybrid' => 'Hybrid',
    ];

    return $mapping[$type] ?? ucfirst(str_replace('-', ' ', $type));
  }

  /**
   * Extract department from job title
   */
  private function getDepartmentFromTitle(string $title): string
  {
    $keywords = [
      'Manager' => 'Management',
      'Developer' => 'IT & Development',
      'Engineer' => 'IT & Development',
      'Designer' => 'Creative',
      'Marketing' => 'Marketing',
      'Sales' => 'Sales',
      'HR' => 'Human Resources',
      'Finance' => 'Finance',
      'Accountant' => 'Finance',
      'Support' => 'Customer Support',
      'Analyst' => 'Data & Analytics',
      'Specialist' => 'Operations',
      'Coordinator' => 'Operations',
      'Executive' => 'Management',
      'Officer' => 'Operations',
      'Assistant' => 'Operations',
      'Intern' => 'Entry Level',
    ];

    foreach ($keywords as $keyword => $department) {
      if (stripos($title, $keyword) !== false) {
        return $department;
      }
    }

    return 'General';
  }
}
