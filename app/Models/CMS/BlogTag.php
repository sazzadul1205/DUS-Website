<?php
// app/Models/CMS/BlogTag.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BlogTag extends Model
{
    protected $table = 'blog_tags';
    
    protected $fillable = [
        'name', 'slug'
    ];
    
    // Blogs relationship
    public function blogs(): BelongsToMany
    {
        return $this->belongsToMany(Blog::class, 'blog_blog_tag');
    }
}