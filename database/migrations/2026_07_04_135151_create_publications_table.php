<?php
// database/migrations/2026_01_15_000000_create_publications_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('excerpt')->nullable();
            $table->longText('full_content')->nullable();
            $table->string('image')->nullable();
            $table->longText('pdf_url')->nullable(); 
            $table->string('date')->nullable();
            $table->string('author')->nullable();
            $table->string('read_time')->nullable();
            $table->json('tags')->nullable();
            $table->string('category')->nullable();
            $table->integer('views')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            // Indexes for better performance
            $table->index('slug');
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('category');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
