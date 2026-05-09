<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run the database seeds in correct order
        $this->call([
            // Base data first
            LocationSeeder::class,
            JobCategorySeeder::class,

            // Users and profiles
            UserSeeder::class,           // Creates Super Admin, Admin, HR Manager, Job Seeker
            ApplicantProfileSeeder::class,

            // Job listings
            JobListingSeeder::class,
            JobListingLocationSeeder::class,

            // User history/data
            JobHistorySeeder::class,
            EducationHistorySeeder::class,
            AchievementSeeder::class,

            // Applications and tracking
            ApplicationSeeder::class,
            StatusTimelineSeeder::class,
            JobViewSeeder::class,

            // RBAC - MUST run after UserSeeder to assign roles to existing users
            RBACSeeder::class,
        ]);

        // Clean storage directories
        Storage::disk('public')->deleteDirectory('cvs');
        Storage::disk('public')->deleteDirectory('profile_photos');
        Storage::disk('public')->deleteDirectory('applicant-cvs');
        Storage::disk('public')->deleteDirectory('applicant-photos');

        // Optional: Create a test user
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
