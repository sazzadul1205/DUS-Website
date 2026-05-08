<?php
// database/migrations/2026_05_08_000004_create_user_roles_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('user_roles', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('role_id')->constrained()->onDelete('cascade');
      $table->foreignId('assigned_by')->nullable()->constrained('users')->onDelete('set null');
      $table->timestamp('assigned_at')->useCurrent();
      $table->boolean('is_active')->default(true);
      $table->timestamp('expires_at')->nullable();
      $table->timestamps();

      $table->unique(['user_id', 'role_id']);
      $table->index('user_id');
      $table->index('role_id');
      $table->index('is_active');
      $table->index('expires_at');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('user_roles');
  }
};
