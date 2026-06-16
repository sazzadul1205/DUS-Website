<?php
// app/Models/CMS/Blog.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Blog extends Model
{
  protected $table = 'blogs';

  protected $fillable = [
    'slug',
    'title',
    'excerpt',
    'content',
    'image',
    'date',
    'created_by',
    'timer_read',
    'is_published'
  ];

  protected $casts = [
    'date' => 'date',
    'is_published' => 'boolean',
  ];

  // Tags relationship
  public function tags(): BelongsToMany
  {
    return $this->belongsToMany(BlogTag::class, 'blog_blog_tag');
  }
}
