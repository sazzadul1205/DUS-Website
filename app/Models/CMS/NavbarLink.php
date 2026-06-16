<?php
// app/Models/CMS/NavbarLink.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class NavbarLink extends Model
{
  protected $table = 'navbar_links';

  protected $fillable = [
    'name',
    'href',
    'order',
    'is_active'
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];
}
