<?php
// database/migrations/2026_05_08_000001_create_permissions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('permissions', function (Blueprint $table) {
      $table->id();
      $table->string('name', 100)->unique();
      $table->string('slug', 100)->unique();
      $table->string('module', 50);
      $table->string('action', 50);
      $table->text('description')->nullable();
      $table->boolean('is_active')->default(true);
      $table->timestamps();

      $table->index('module');
      $table->index('action');
      $table->index('is_active');
      $table->unique(['module', 'action']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('permissions');
  }
};
