<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Profile\ApplicantProfileController;

// Applicant Profile (User Own) - URL: /backend/applicant/*
Route::prefix('applicant')->name('applicant.')->group(function () {
  // Show profile - optional ID (if no ID, shows authenticated user's profile)
  Route::get('/profile/{id?}', [ApplicantProfileController::class, 'show'])->name('profile.show');

  // Delete profile
  Route::delete('/profile/{applicantProfile}', [ApplicantProfileController::class, 'destroy'])->name('profile.destroy');

  // Download CV
  Route::get('/profile/{applicantProfile}/download-cv', [ApplicantProfileController::class, 'downloadCV'])->name('profile.download-cv');

  // Restore profile
  Route::post('/profile/{id}/restore', [ApplicantProfileController::class, 'restore'])->name('profile.restore');

  // Update sections
  Route::patch('/profile/{applicantProfile}/basic-info', [ApplicantProfileController::class, 'updateBasicInfo'])->name('profile.update-basic-info');
  Route::patch('/profile/{applicantProfile}/professional-info', [ApplicantProfileController::class, 'updateProfessionalInfo'])->name('profile.update-professional-info');
  Route::put('/profile/{applicantProfile}/work-experiences', [ApplicantProfileController::class, 'updateWorkExperiences'])->name('profile.update-work-experiences');
  Route::put('/profile/{applicantProfile}/educations', [ApplicantProfileController::class, 'updateEducations'])->name('profile.update-educations');
  Route::put('/profile/{applicantProfile}/achievements', [ApplicantProfileController::class, 'updateAchievements'])->name('profile.update-achievements');

  // Change password
  Route::post('/profile/change-password', [ApplicantProfileController::class, 'changePassword'])->name('profile.change-password');

  // Get profile data (AJAX)
  Route::get('/profile/{applicantProfile}/data', [ApplicantProfileController::class, 'getProfileData'])->name('profile.get-data');
});
