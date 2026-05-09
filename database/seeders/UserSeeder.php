<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $users = [];

        // ==========================================
        // 1. SUPER ADMIN (Highest level)
        // ==========================================
        $users[] = [
            'name' => 'Super Admin',
            'email' => 'superadmin@jobportal.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => $now,
            'remember_token' => Str::random(10),
            'created_at' => $now,
            'updated_at' => $now,
        ];

        // ==========================================
        // 2. ADMIN (Regular admin)
        // ==========================================
        $users[] = [
            'name' => 'Admin User',
            'email' => 'admin@jobportal.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => $now,
            'remember_token' => Str::random(10),
            'created_at' => $now,
            'updated_at' => $now,
        ];

        // ==========================================
        // 3. EMPLOYER / HR MANAGER
        // ==========================================
        $users[] = [
            'name' => 'HR Manager',
            'email' => 'hrmanager@company.com',
            'password' => Hash::make('password'),
            'role' => 'employer',
            'email_verified_at' => $now,
            'remember_token' => Str::random(10),
            'created_at' => $now,
            'updated_at' => $now,
        ];

        // ==========================================
        // 4. JOB SEEKER (Regular user)
        // ==========================================
        $users[] = [
            'name' => 'Job Seeker',
            'email' => 'jobseeker@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'job_seeker',
            'email_verified_at' => $now,
            'remember_token' => Str::random(10),
            'created_at' => $now,
            'updated_at' => $now,
        ];

        // ==========================================
        // Additional employers (for variety)
        // ==========================================
        $employers = [
            'Tech Solutions Ltd',
            'Bengal Software',
            'Grameenphone',
            'Robi',
            'Banglalink',
            'BRAC Bank',
            'Dutch-Bangla Bank',
            'Square Pharmaceuticals',
            'Renata Limited',
        ];

        foreach ($employers as $employer) {
            $users[] = [
                'name' => $employer,
                'email' => Str::slug($employer, '.') . '@company.com',
                'password' => Hash::make('password'),
                'role' => 'employer',
                'email_verified_at' => $now,
                'remember_token' => Str::random(10),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // ==========================================
        // Additional job seekers
        // ==========================================
        $firstNames = ['Rafiq', 'Shamim', 'Rina', 'Hasan', 'Nadia', 'Farhan', 'Tahmina', 'Rakib', 'Shanta', 'Mahmud'];
        $lastNames = ['Ahmed', 'Khan', 'Rahman', 'Islam', 'Hossain', 'Akter', 'Begum', 'Ali', 'Haque', 'Chowdhury'];

        // Create 50 job seekers
        for ($i = 0; $i < 50; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $email = strtolower($firstName . $lastName . $i . '@gmail.com');

            $users[] = [
                'name' => $firstName . ' ' . $lastName,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'job_seeker',
                'email_verified_at' => $now,
                'remember_token' => Str::random(10),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $users = collect($users)->unique('email')->values()->all();

        DB::table('users')->upsert(
            $users,
            ['email'],
            ['name', 'password', 'role', 'email_verified_at', 'remember_token', 'updated_at']
        );
    }
}
