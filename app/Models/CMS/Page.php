<?php
// app/Models/CMS/Page.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Page extends Model
{
    protected $table = 'pages';
    
    protected $fillable = [
        'parent_id', 'slug', 'title', 'meta_description', 'is_active'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
    ];
    
    // Parent page (for hierarchy)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'parent_id');
    }
    
    // Child pages
    public function children(): HasMany
    {
        return $this->hasMany(Page::class, 'parent_id')->orderBy('slug');
    }
    
    // Sections on this page
    public function sections(): HasMany
    {
        return $this->hasMany(Section::class)->orderBy('order');
    }
    
    // Get full slug with parent
    public function getFullSlugAttribute(): string
    {
        if ($this->parent) {
            return $this->parent->slug . '/' . $this->slug;
        }
        return $this->slug;
    }
}