<?php
// database/migrations/2026_05_08_000005_create_role_module_access_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('role_module_access', function (Blueprint $table) {
      $table->id();
      $table->foreignId('role_id')->constrained()->onDelete('cascade');
      $table->string('module', 50);
      $table->enum('access_level', ['no_access', 'read', 'write', 'manage'])->default('no_access');
      $table->timestamps();

      $table->unique(['role_id', 'module']);
      $table->index('role_id');
      $table->index('module');
      $table->index('access_level');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('role_module_access');
  }
};
