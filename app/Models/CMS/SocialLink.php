<?php
// app/Models/CMS/SocialLink.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
  protected $table = 'social_links';

  protected $fillable = [
    'platform',
    'icon_name',
    'url',
    'hover_color',
    'order',
    'is_active'
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];
}
