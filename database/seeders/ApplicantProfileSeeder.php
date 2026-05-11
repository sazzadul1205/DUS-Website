<?php
// database/seeders/ApplicantProfileSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApplicantProfileSeeder extends Seeder
{
    public function run(): void
    {
        $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        $genders = ['male', 'female', 'other'];
        $jobTitles = [
            'Software Engineer',
            'Web Developer',
            'Digital Marketer',
            'Content Writer',
            'Graphic Designer',
            'Project Manager',
            'HR Executive',
            'Accountant',
            'Sales Executive',
            'Customer Support',
            'Data Analyst',
            'Network Administrator'
        ];

        // Get all job seeker user IDs - Without 'role' column, we need to get users who have job_seeker role via RBAC
        // For seeding purposes, we'll get users who are NOT employers (based on email patterns or manual selection)
        $allUsers = DB::table('users')->get();

        // For seeding, we'll consider users without 'company' in email as job seekers
        // In production, you'd check user_roles table, but during seeding RBAC runs after this
        $jobSeekerUsers = $allUsers->filter(function ($user) {
            return !str_contains($user->email, '@company.com')
                && $user->email !== 'admin@jobportal.com'
                && $user->email !== 'superadmin@jobportal.com'
                && $user->email !== 'hrmanager@company.com';
        });

        $profiles = [];

        foreach ($jobSeekerUsers as $index => $user) {
            $nameParts = explode(' ', $user->name);
            $firstName = $nameParts[0] ?? '';
            $lastName = $nameParts[1] ?? '';

            $profiles[] = [
                'user_id' => $user->id,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'birth_date' => now()->subYears(rand(22, 40))->subDays(rand(0, 365)),
                'gender' => $genders[array_rand($genders)],
                'blood_type' => $bloodTypes[array_rand($bloodTypes)],
                'phone' => '01' . rand(1, 9) . rand(10000000, 99999999),
                'address' => 'House ' . rand(1, 100) . ', Road ' . rand(1, 20) . ', Dhaka',
                'experience_years' => rand(0, 15),
                'current_job_title' => $jobTitles[array_rand($jobTitles)],
                'social_links' => json_encode([
                    'github' => 'https://github.com/user' . $index,
                    'portfolio' => 'https://portfolio.user' . $index . '.com'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (!empty($profiles)) {
            DB::table('applicant_profiles')->insert($profiles);
        }
    }
}
