<?php
// app/Traits/HasRoles.php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait HasRoles
{
  public function roles()
  {
    return $this->belongsToMany(\App\Models\Role::class, 'user_roles', 'user_id', 'role_id')
      ->withPivot('assigned_at', 'expires_at', 'is_active')
      ->wherePivot('is_active', true)
      ->where(function ($q) {
        $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
      });
  }

  public function hasRole($roleSlug)
  {
    return $this->roles()->where('slug', $roleSlug)->exists();
  }

  public function hasPermission($permissionSlug)
  {
    // Check via roles
    $hasPermission = $this->roles()
      ->join('role_permissions', 'roles.id', '=', 'role_permissions.role_id')
      ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
      ->where('permissions.slug', $permissionSlug)
      ->where('role_permissions.granted', true)
      ->exists();

    if ($hasPermission) {
      return true;
    }

    // Fallback to legacy role field
    return $this->checkLegacyPermission($permissionSlug);
  }

  public function getModuleAccess($module)
  {
    $accessLevel = $this->roles()
      ->join('role_module_access', 'roles.id', '=', 'role_module_access.role_id')
      ->where('role_module_access.module', $module)
      ->orderByRaw("FIELD(access_level, 'manage', 'write', 'read', 'no_access')")
      ->value('access_level');

    return $accessLevel ?? 'no_access';
  }

  public function canAccess($module, $requiredLevel = 'read')
  {
    $levels = ['no_access' => 0, 'read' => 1, 'write' => 2, 'manage' => 3];
    $userLevel = $levels[$this->getModuleAccess($module)] ?? 0;
    $required = $levels[$requiredLevel] ?? 0;

    return $userLevel >= $required;
  }

  public function assignRole($roleSlug, $assignedBy = null)
  {
    $role = \App\Models\Role::where('slug', $roleSlug)->first();
    if (!$role) {
      return false;
    }

    return $this->roles()->attach($role->id, [
      'assigned_by' => $assignedBy,
      'assigned_at' => now(),
      'is_active' => true,
      'created_at' => now(),
      'updated_at' => now(),
    ]);
  }

  public function syncRoles($roleSlugs)
  {
    $roleIds = \App\Models\Role::whereIn('slug', $roleSlugs)->pluck('id')->toArray();
    return $this->roles()->sync($roleIds);
  }

  public function removeRole($roleSlug)
  {
    $role = \App\Models\Role::where('slug', $roleSlug)->first();
    if (!$role) {
      return false;
    }

    return $this->roles()->detach($role->id);
  }

  protected function checkLegacyPermission($permissionSlug)
  {
    // Map legacy roles to basic permissions
    $legacyPermissions = [
      'admin' => [
        'profile.view.any',
        'profile.edit.any',
        'profile.delete.any',
        'job.view.any',
        'job.edit.any',
        'job.delete.any',
        'application.view.any',
        'application.shortlist',
        'application.reject',
        'application.hire',
        'category.create',
        'category.edit',
        'category.delete',
        'location.create',
        'location.edit',
        'location.delete',
        'user.view',
        'user.create',
        'user.edit',
        'user.delete',
      ],
      'employer' => [
        'profile.edit.own',
        'job.create',
        'job.edit.own',
        'job.delete.own',
        'application.view.for_own_jobs',
        'application.shortlist',
        'application.reject',
      ],
      'job_seeker' => [
        'profile.edit.own',
        'job.view.any',
        'application.apply',
        'application.view.own',
      ],
    ];

    $userRole = $this->role;
    return in_array($permissionSlug, $legacyPermissions[$userRole] ?? []);
  }
}
