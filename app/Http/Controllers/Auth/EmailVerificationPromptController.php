<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ApplicantProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        // If already verified, redirect to profile completion
        if ($request->user()->hasVerifiedEmail()) {
            $user = $request->user();

            // Check if profile needs to be completed
            if ($user && $this->userHasRole($user, 'job-seeker')) {
                $profile = ApplicantProfile::where('user_id', $user->id)->first();
                if (!$profile || !$profile->isComplete()) {
                    return redirect()->intended(route('profile.complete'));
                }
            }

            return redirect()->intended(route('dashboard', absolute: false));
        }

        return Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Helper method to check user role safely
     */
    private function userHasRole(?User $user, string $roleSlug): bool
    {
        if (!$user) {
            return false;
        }

        if (method_exists($user, 'hasRole')) {
            return $user->hasRole($roleSlug);
        }

        return $user->roles()->where('slug', $roleSlug)->exists();
    }
}
