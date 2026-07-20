<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Profile\ApplicantProfileController;

// Applicant Profile Management (Admin) - URL: /backend/applicant-profiles/*
Route::prefix('applicant-profiles')->name('applicant-profile.')->group(function () {
  Route::get('/', [ApplicantProfileController::class, 'index'])->name('index');
  Route::get('/{id}', [ApplicantProfileController::class, 'show'])->name('show');
  Route::post('/bulk/delete', [ApplicantProfileController::class, 'bulkDelete'])->name('bulk-delete');
  Route::post('/bulk/restore', [ApplicantProfileController::class, 'bulkRestore'])->name('bulk-restore');
  Route::delete('/{id}', [ApplicantProfileController::class, 'destroy'])->name('destroy');
  Route::post('/{id}/restore', [ApplicantProfileController::class, 'restore'])->name('restore');
  Route::delete('/{id}/force', [ApplicantProfileController::class, 'forceDelete'])->name('force-delete');
  Route::post('/export', [ApplicantProfileController::class, 'export'])->name('export');
  Route::post('/cv/upload', [ApplicantProfileController::class, 'uploadCv'])->name('cv.upload');
  Route::delete('/cv/{cv}', [ApplicantProfileController::class, 'destroyCv'])->name('cv.destroy');
  Route::patch('/cv/{cv}/primary', [ApplicantProfileController::class, 'setPrimaryCv'])->name('cv.primary');
});
