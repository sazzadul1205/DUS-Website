<?php
// database/migrations/2026_05_08_000002_create_roles_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('roles', function (Blueprint $table) {
      $table->id();
      $table->string('name', 100)->unique();
      $table->string('slug', 100)->unique();
      $table->text('description')->nullable();
      $table->integer('level')->default(0);
      $table->boolean('is_default')->default(false);
      $table->boolean('is_active')->default(true);
      $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
      $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
      $table->timestamps();
      $table->softDeletes();

      $table->index('level');
      $table->index('is_default');
      $table->index('is_active');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('roles');
  }
};
