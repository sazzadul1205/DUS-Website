<?php
// app/Models/CMS/Stat.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class Stat extends Model
{
  protected $table = 'stats';

  protected $fillable = [
    'page_slug',
    'value',
    'suffix',
    'label',
    'icon',
    'order',
    'is_active'
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];
}
