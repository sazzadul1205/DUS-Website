<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\ApplicantProfile;
use Symfony\Component\HttpFoundation\Response;

class EnsureApplicantProfileComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is not authenticated, proceed
        if (!$user) {
            return $next($request);
        }

        // Check if user has job-seeker role using RBAC
        if (!$user->hasRole('job-seeker')) {
            return $next($request);
        }

        // Routes that should bypass profile completion check
        $bypassRoutes = [
            'profile.complete',
            'profile.complete.store',
            'logout',
            'verification.*',
            'profile.photo.upload',
            'profile.cv.upload',
            'profile.cv.destroy',
            'profile.cv.primary',
        ];

        if ($request->routeIs(...$bypassRoutes)) {
            return $next($request);
        }

        // Check if user has a profile
        $profile = ApplicantProfile::withTrashed()
            ->where('user_id', $user->id)
            ->first();

        // If the profile was soft deleted, do not force completion flow
        if ($profile && $profile->trashed()) {
            return $next($request);
        }

        // Check if profile is complete
        if (!$profile || !$profile->isComplete()) {
            // Check if the current route is the dashboard or any protected route
            $currentRoute = Route::currentRouteName();

            // If it's the dashboard or any backend route, redirect to profile completion
            if ($currentRoute === 'backend.dashboard' || str_starts_with($currentRoute, 'backend.')) {
                return redirect()->route('profile.complete')
                    ->with('warning', 'Please complete your profile to access this page.');
            }

            // For other routes, still redirect to profile completion
            return redirect()->route('profile.complete')
                ->with('warning', 'Please complete your profile to access this page.');
        }

        return $next($request);
    }
}
