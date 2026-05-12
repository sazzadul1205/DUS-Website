<?php
// app/Http/Controllers/Profile/AdminProfileController.php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminProfileController extends Controller
{
  /**
   * Show the admin profile edit form.
   */
  public function edit()
  {
    $user = Auth::user();

    if (!$user instanceof User) {
      abort(401);
    }

    // Ensure the authenticated user has admin or super-admin role via RBAC
    if (!$user->hasAnyRole(['admin', 'super-admin'])) {
      abort(403, 'Unauthorized action.');
    }

    // Get user's highest role for display
    $primaryRole = $user->roles()->orderBy('level', 'desc')->first();

    return Inertia::render('Backend/Profile/Admin/Edit', [
      'user' => [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'primary_role' => $primaryRole ? $primaryRole->name : 'Admin',
      ],
    ]);
  }

  /**
   * Update the admin's profile information (name, email).
   */
  public function update(Request $request)
  {
    $user = Auth::user();

    if (!$user instanceof User) {
      abort(401);
    }

    if (!$user->hasAnyRole(['admin', 'super-admin'])) {
      abort(403);
    }

    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'email' => [
        'required',
        'email',
        Rule::unique('users')->ignore($user->id),
      ],
    ]);

    $user->update($validated);

    return redirect()->back()->with('success', 'Profile updated successfully.');
  }

  /**
   * Update the admin's password.
   */
  public function updatePassword(Request $request)
  {
    $user = Auth::user();

    if (!$user instanceof User) {
      abort(401);
    }

    if (!$user->hasAnyRole(['admin', 'super-admin'])) {
      abort(403);
    }

    $request->validate([
      'current_password' => ['required', 'current_password'],
      'password' => ['required', 'string', 'min:8', 'confirmed'],
    ]);

    $user->update([
      'password' => Hash::make($request->password),
    ]);

    return back()->with('success', 'Password updated successfully.');
  }
}
