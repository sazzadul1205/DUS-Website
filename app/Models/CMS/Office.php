<?php
// app/Models/CMS/Office.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
  protected $table = 'offices';

  protected $fillable = [
    'title',
    'address',
    'phones',
    'emails',
    'map_url',
    'coordinates',
    'order',
    'is_active'
  ];

  protected $casts = [
    'phones' => 'array',
    'emails' => 'array',
    'coordinates' => 'array',
    'is_active' => 'boolean',
  ];
}
