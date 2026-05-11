<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    /**
     * System role slugs that must never be deleted (security rule).
     */
    private const NON_DELETABLE_ROLE_SLUGS = [
        'super-admin',
        'admin',
        'employer',
        'employer-admin',
        'job_seeker',
        'job-seeker',
    ];

    private function roleIsNonDeletable(Role $role): bool
    {
        return $role->is_default || in_array($role->slug, self::NON_DELETABLE_ROLE_SLUGS, true);
    }

    /**
     * Display a listing of roles
     */
    public function index(Request $request)
    {
        $query = Role::with(['creator', 'updater']);

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status === 'active');
        }

        // Search by name or description
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by level range
        if ($request->has('min_level') && $request->min_level !== '') {
            $query->where('level', '>=', (int) $request->min_level);
        }

        if ($request->has('max_level') && $request->max_level !== '') {
            $query->where('level', '<=', (int) $request->max_level);
        }

        $sortField = $request->get('sort', 'level');
        $sortDirection = $request->get('direction', 'asc');

        $allowedSortFields = ['name', 'slug', 'level', 'is_active', 'created_at', 'updated_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('level', 'asc');
        }

        $roles = $query->paginate(20)->withQueryString();

        // Add user count and permission count to each role
        $roles->getCollection()->transform(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'level' => $role->level,
                'is_default' => $role->is_default,
                'is_active' => $role->is_active,
                'user_count' => $role->users()->count(),
                'permission_count' => $role->grantedPermissions()->count(),
                'created_at' => $role->created_at,
                'updated_at' => $role->updated_at,
                'creator' => $role->creator ? [
                    'id' => $role->creator->id,
                    'name' => $role->creator->name,
                ] : null,
            ];
        });

        // Get summary statistics
        $stats = [
            'total' => Role::count(),
            'active' => Role::where('is_active', true)->count(),
            'inactive' => Role::where('is_active', false)->count(),
            'default' => Role::where('is_default', true)->count(),
            'total_deleted' => Role::onlyTrashed()->count(),
        ];

        return inertia('Backend/Roles/Index', [
            'roles' => $roles,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search', 'min_level', 'max_level', 'sort', 'direction']),
        ]);
    }

    /**
     * Show form to create a new role
     */
    public function create()
    {
        // Get all permissions grouped by module
        $permissions = Permission::active()
            ->orderBy('module')
            ->orderBy('name')
            ->get()
            ->groupBy('module')
            ->map(function ($permissions, $module) {
                return [
                    'module' => $module,
                    'permissions' => $permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'slug' => $permission->slug,
                            'action' => $permission->action,
                            'description' => $permission->description,
                        ];
                    }),
                ];
            })
            ->values();

        // Get existing roles for level reference
        $existingLevels = Role::select('level', 'name')->orderBy('level')->get();

        return inertia('Backend/Roles/Create', [
            'permissions' => $permissions,
            'existingLevels' => $existingLevels,
            'accessLevels' => [
                ['value' => 'no_access', 'label' => 'No Access'],
                ['value' => 'read', 'label' => 'Read Only'],
                ['value' => 'write', 'label' => 'Read & Write'],
                ['value' => 'manage', 'label' => 'Full Management'],
            ],
        ]);
    }

    /**
     * Store a newly created role
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'slug' => 'required|string|max:255|unique:roles,slug|regex:/^[a-z0-9-]+$/',
            'description' => 'nullable|string|max:500',
            'level' => 'required|integer|min:1|max:100',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
            'module_access' => 'array',
            'module_access.*.module' => 'required|string',
            'module_access.*.access_level' => 'required|in:no_access,read,write,manage',
        ]);

        try {
            DB::beginTransaction();

            // Create the role
            $role = Role::create([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'] ?? null,
                'level' => $validated['level'],
                'is_default' => $validated['is_default'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            // Assign permissions
            if (!empty($validated['permissions'])) {
                $permissionsWithGranted = [];
                foreach ($validated['permissions'] as $permissionId) {
                    $permissionsWithGranted[$permissionId] = ['granted' => true];
                }
                $role->permissions()->attach($permissionsWithGranted);
            }

            // Set module access levels
            if (!empty($validated['module_access'])) {
                foreach ($validated['module_access'] as $moduleAccess) {
                    $role->setModuleAccess($moduleAccess['module'], $moduleAccess['access_level']);
                }
            }

            DB::commit();

            Log::info('Role created', [
                'role_id' => $role->id,
                'role_name' => $role->name,
                'created_by' => Auth::id(),
            ]);

            return redirect()->route('backend.roles.index')
                ->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to create role', [
                'error' => $e->getMessage(),
                'data' => $validated,
            ]);

            return back()->with('error', 'Failed to create role: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display a specific role with its details
     */
    public function show(int $id)
    {
        $role = Role::with(['creator', 'updater'])
            ->withTrashed()
            ->findOrFail($id);

        // Get users with this role (limited to 10 for preview)
        $users = $role->users()
            ->with('applicantProfile')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'profile_completed' => $user->applicantProfile ? true : false,
                ];
            });

        $userCount = $role->users()->count();

        // Get granted permissions grouped by module
        $permissions = $role->grantedPermissions()
            ->orderBy('module')
            ->orderBy('name')
            ->get()
            ->groupBy('module')
            ->map(function ($permissions, $module) {
                return [
                    'module' => $module,
                    'permissions' => $permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'slug' => $permission->slug,
                            'action' => $permission->action,
                            'description' => $permission->description,
                        ];
                    }),
                ];
            })
            ->values();

        // Get module access levels
        $moduleAccess = $role->moduleAccess()->get()->map(function ($access) {
            return [
                'module' => $access->module,
                'access_level' => $access->access_level,
            ];
        });

        return inertia('Backend/Roles/Show', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'level' => $role->level,
                'is_default' => $role->is_default,
                'is_active' => $role->is_active,
                'user_count' => $userCount,
                'permission_count' => $permissions->count(),
                'created_at' => $role->created_at,
                'updated_at' => $role->updated_at,
                'deleted_at' => $role->deleted_at,
                'creator' => $role->creator ? [
                    'id' => $role->creator->id,
                    'name' => $role->creator->name,
                ] : null,
                'updater' => $role->updater ? [
                    'id' => $role->updater->id,
                    'name' => $role->updater->name,
                ] : null,
            ],
            'users' => $users,
            'permissions' => $permissions,
            'moduleAccess' => $moduleAccess,
            'isDeleted' => $role->trashed(),
        ]);
    }

    /**
     * Show form to edit a role
     */
    public function edit(int $id)
    {
        $role = Role::findOrFail($id);

        if ($this->roleIsNonDeletable($role)) {
            return redirect()->route('backend.roles.index')
                ->with('error', "The '{$role->name}' role cannot be edited.");
        }

        // Get all permissions grouped by module
        $allPermissions = Permission::active()
            ->orderBy('module')
            ->orderBy('name')
            ->get()
            ->groupBy('module')
            ->map(function ($permissions, $module) {
                return [
                    'module' => $module,
                    'permissions' => $permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'slug' => $permission->slug,
                            'action' => $permission->action,
                            'description' => $permission->description,
                        ];
                    }),
                ];
            })
            ->values();

        // Get already granted permission IDs
        $grantedPermissionIds = $role->grantedPermissions()->pluck('permissions.id')->toArray();

        // Get existing module access levels
        $moduleAccess = $role->moduleAccess()->get()->map(function ($access) {
            return [
                'module' => $access->module,
                'access_level' => $access->access_level,
            ];
        });

        // Get existing roles for level reference (excluding current)
        $existingLevels = Role::where('id', '!=', $role->id)
            ->select('level', 'name')
            ->orderBy('level')
            ->get();

        // Get list of modules available from permissions
        $availableModules = Permission::select('module')
            ->distinct()
            ->pluck('module')
            ->toArray();

        return inertia('Backend/Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'level' => $role->level,
                'is_default' => $role->is_default,
                'is_active' => $role->is_active,
            ],
            'permissions' => $allPermissions,
            'grantedPermissionIds' => $grantedPermissionIds,
            'moduleAccess' => $moduleAccess,
            'availableModules' => $availableModules,
            'existingLevels' => $existingLevels,
            'accessLevels' => [
                ['value' => 'no_access', 'label' => 'No Access'],
                ['value' => 'read', 'label' => 'Read Only'],
                ['value' => 'write', 'label' => 'Read & Write'],
                ['value' => 'manage', 'label' => 'Full Management'],
            ],
        ]);
    }

    /**
     * Update a specific role
     */
    public function update(Request $request, int $id)
    {
        $role = Role::findOrFail($id);

        if ($this->roleIsNonDeletable($role)) {
            return back()->with('error', "The '{$role->name}' role cannot be edited.");
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9-]+$/', Rule::unique('roles')->ignore($role->id)],
            'description' => 'nullable|string|max:500',
            'level' => 'required|integer|min:1|max:100',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
            'module_access' => 'array',
            'module_access.*.module' => 'required|string',
            'module_access.*.access_level' => 'required|in:no_access,read,write,manage',
        ]);

        try {
            DB::beginTransaction();

            // Update role basic info
            $role->update([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'] ?? null,
                'level' => $validated['level'],
                'is_default' => $validated['is_default'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
                'updated_by' => Auth::id(),
            ]);

            // Sync permissions
            $permissionsWithGranted = [];
            if (!empty($validated['permissions'])) {
                foreach ($validated['permissions'] as $permissionId) {
                    $permissionsWithGranted[$permissionId] = ['granted' => true];
                }
            }
            $role->permissions()->sync($permissionsWithGranted);

            // Sync module access levels
            $role->moduleAccess()->delete();
            if (!empty($validated['module_access'])) {
                foreach ($validated['module_access'] as $moduleAccess) {
                    $role->setModuleAccess($moduleAccess['module'], $moduleAccess['access_level']);
                }
            }

            DB::commit();

            Log::info('Role updated', [
                'role_id' => $role->id,
                'role_name' => $role->name,
                'updated_by' => Auth::id(),
            ]);

            return redirect()->route('backend.roles.show', $role->id)
                ->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to update role', [
                'role_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to update role: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Soft delete a role (if it has no users assigned)
     */
    public function destroy(int $id)
    {
        $role = Role::findOrFail($id);

        // Prevent deleting system roles
        if ($this->roleIsNonDeletable($role)) {
            $message = "The '{$role->name}' role cannot be deleted.";
            if (request()->header('X-Inertia')) {
                return back()->with('error', $message);
            }

            return response()->json(['success' => false, 'message' => $message], 403);
        }

        // Check if role has any users assigned
        $userCount = $role->users()->count();

        if ($userCount > 0) {
            return back()->with('error', "Cannot delete role '{$role->name}' because it has {$userCount} user(s) assigned. Please reassign users first.");
        }

        try {
            DB::beginTransaction();

            // Detach all permissions and module access
            $role->permissions()->detach();
            $role->moduleAccess()->delete();

            // Soft delete the role
            $role->delete();

            DB::commit();

            Log::info('Role soft deleted', [
                'role_id' => $role->id,
                'role_name' => $role->name,
                'deleted_by' => Auth::id(),
            ]);

            return redirect()->route('backend.roles.index')
                ->with('success', "Role '{$role->name}' deleted successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete role', [
                'role_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to delete role: ' . $e->getMessage());
        }
    }

    /**
     * Restore a soft-deleted role
     */
    public function restore(int $id)
    {
        $role = Role::onlyTrashed()->findOrFail($id);

        try {
            $role->restore();

            Log::info('Role restored', [
                'role_id' => $role->id,
                'role_name' => $role->name,
                'restored_by' => Auth::id(),
            ]);

            return redirect()->route('backend.roles.show', $role->id)
                ->with('success', "Role '{$role->name}' restored successfully.");
        } catch (\Exception $e) {
            Log::error('Failed to restore role', [
                'role_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to restore role: ' . $e->getMessage());
        }
    }

    /**
     * Display list of soft-deleted roles
     */
    public function trashed(Request $request)
    {
        $query = Role::onlyTrashed()->with(['creator', 'updater']);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $roles = $query->orderBy('deleted_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        $roles->getCollection()->transform(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'level' => $role->level,
                'is_default' => $role->is_default,
                'deleted_at' => $role->deleted_at,
                'deleted_by' => $role->updater?->name ?? 'System',
            ];
        });

        $stats = [
            'total_deleted' => Role::onlyTrashed()->count(),
        ];

        return inertia('Backend/Roles/Trashed', [
            'roles' => $roles,
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Permanently delete a soft-deleted role (force delete)
     */
    public function forceDelete(int $id)
    {
        $role = Role::onlyTrashed()->findOrFail($id);

        // Prevent force deleting system roles
        if ($this->roleIsNonDeletable($role)) {
            $message = "The '{$role->name}' role cannot be permanently deleted.";
            if (request()->header('X-Inertia')) {
                return back()->with('error', $message);
            }

            return response()->json(['success' => false, 'message' => $message], 403);
        }

        try {
            // Ensure permissions and module access are detached
            $role->permissions()->detach();
            $role->moduleAccess()->delete();

            $roleName = $role->name;
            $role->forceDelete();

            Log::info('Role force deleted permanently', [
                'role_id' => $id,
                'role_name' => $roleName,
                'deleted_by' => Auth::id(),
            ]);

            return redirect()->route('backend.roles.index')
                ->with('success', "Role '{$roleName}' has been permanently deleted.");
        } catch (\Exception $e) {
            Log::error('Failed to force delete role', [
                'role_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to permanently delete role: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete roles (soft delete)
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'role_ids' => 'required|array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $deletedCount = 0;
        $failedRoles = [];

        foreach ($request->role_ids as $roleId) {
            $role = Role::find($roleId);

            if (!$role) {
                $failedRoles[] = $roleId;
                continue;
            }

            // Skip protected system roles
            if ($this->roleIsNonDeletable($role)) {
                $failedRoles[] = $role->name . ' (protected role)';
                continue;
            }

            // Check if has users
            if ($role->users()->count() > 0) {
                $failedRoles[] = $role->name . ' (has users assigned)';
                continue;
            }

            try {
                $role->permissions()->detach();
                $role->moduleAccess()->delete();
                $role->delete();
                $deletedCount++;
            } catch (\Exception $e) {
                $failedRoles[] = $role->name;
                Log::error('Bulk delete failed for role', [
                    'role_id' => $roleId,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $message = "{$deletedCount} role(s) deleted successfully.";
        if (!empty($failedRoles)) {
            $message .= " Failed: " . implode(', ', $failedRoles);
        }

        return back()->with('success', $message);
    }

    /**
     * Bulk restore soft-deleted roles
     */
    public function bulkRestore(Request $request)
    {
        $request->validate([
            'role_ids' => 'required|array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $restoredCount = Role::onlyTrashed()
            ->whereIn('id', $request->role_ids)
            ->restore();

        Log::info('Bulk roles restored', [
            'count' => $restoredCount,
            'role_ids' => $request->role_ids,
            'restored_by' => Auth::id(),
        ]);

        return back()->with('success', "{$restoredCount} role(s) restored successfully.");
    }

    /**
     * Toggle role active status
     */
    public function toggleStatus(int $id)
    {
        $role = Role::findOrFail($id);

        // Prevent toggling protected system roles
        if ($this->roleIsNonDeletable($role)) {
            $message = "The '{$role->name}' role cannot be activated/deactivated.";
            return response()->json([
                'success' => false,
                'message' => $message,
            ], 422);
        }

        $newStatus = !$role->is_active;
        $role->update([
            'is_active' => $newStatus,
            'updated_by' => Auth::id(),
        ]);

        Log::info('Role status toggled', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'new_status' => $newStatus,
            'updated_by' => Auth::id(),
        ]);

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'is_active' => $newStatus,
                'message' => "Role '{$role->name}' has been " . ($newStatus ? 'activated' : 'deactivated') . ".",
            ]);
        }

        return back()->with('success', "Role '{$role->name}' has been " . ($newStatus ? 'activated' : 'deactivated') . ".");
    }

    /**
     * Clone an existing role (creates a copy)
     */
    public function clone(int $id)
    {
        $originalRole = Role::with(['grantedPermissions', 'moduleAccess'])->findOrFail($id);

        if ($this->roleIsNonDeletable($originalRole)) {
            return back()->with('error', "The '{$originalRole->name}' role cannot be cloned.");
        }

        // Generate unique slug and name
        $newSlug = $originalRole->slug . '-copy';
        $counter = 1;
        while (Role::where('slug', $newSlug)->exists()) {
            $newSlug = $originalRole->slug . '-copy-' . $counter;
            $counter++;
        }

        $newName = $originalRole->name . ' (Copy)';

        try {
            DB::beginTransaction();

            $newRole = Role::create([
                'name' => $newName,
                'slug' => $newSlug,
                'description' => $originalRole->description . ' (Cloned from ' . $originalRole->name . ')',
                'level' => $originalRole->level,
                'is_default' => false, // Cloned roles are never default
                'is_active' => false,   // Cloned roles start as inactive
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            // Clone permissions
            $permissionsWithGranted = [];
            foreach ($originalRole->grantedPermissions as $permission) {
                $permissionsWithGranted[$permission->id] = ['granted' => true];
            }
            if (!empty($permissionsWithGranted)) {
                $newRole->permissions()->attach($permissionsWithGranted);
            }

            // Clone module access
            foreach ($originalRole->moduleAccess as $moduleAccess) {
                $newRole->setModuleAccess($moduleAccess->module, $moduleAccess->access_level);
            }

            DB::commit();

            Log::info('Role cloned', [
                'original_role_id' => $originalRole->id,
                'new_role_id' => $newRole->id,
                'cloned_by' => Auth::id(),
            ]);

            return redirect()->route('backend.roles.edit', $newRole->id)
                ->with('success', "Role cloned successfully. You can now edit the copy.");
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to clone role', [
                'original_role_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to clone role: ' . $e->getMessage());
        }
    }

    /**
     * Export roles to CSV
     */
    public function export(Request $request)
    {
        $query = Role::with(['creator', 'updater']);

        // Apply filters similar to index
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status === 'active');
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
        }

        $roles = $query->orderBy('level')->get();

        $filename = 'roles_export_' . date('Y-m-d_His') . '.csv';

        $output = fopen('php://temp', 'w');
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

        // Headers
        fputcsv($output, [
            'ID',
            'Name',
            'Slug',
            'Description',
            'Level',
            'Is Default',
            'Is Active',
            'User Count',
            'Permission Count',
            'Created At',
            'Created By',
            'Updated At',
            'Updated By',
        ]);

        foreach ($roles as $role) {
            fputcsv($output, [
                $role->id,
                $role->name,
                $role->slug,
                $role->description,
                $role->level,
                $role->is_default ? 'Yes' : 'No',
                $role->is_active ? 'Yes' : 'No',
                $role->users()->count(),
                $role->grantedPermissions()->count(),
                $role->created_at?->format('Y-m-d H:i:s'),
                $role->creator?->name ?? 'N/A',
                $role->updated_at?->format('Y-m-d H:i:s'),
                $role->updater?->name ?? 'N/A',
            ]);
        }

        rewind($output);
        $csvContent = stream_get_contents($output);
        fclose($output);

        return response($csvContent, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
