<?php
// app/Models/CMS/FooterLink.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class FooterLink extends Model
{
  protected $table = 'footer_links';

  protected $fillable = [
    'category',
    'name',
    'url',
    'order',
    'is_active'
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];

  // Scopes for categories
  public function scopeQuickLinks($query)
  {
    return $query->where('category', 'quick_links');
  }

  public function scopePrograms($query)
  {
    return $query->where('category', 'programs');
  }
}
