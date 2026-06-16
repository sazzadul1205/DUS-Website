<?php
// app/Models/CMS/Career.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
  protected $table = 'careers';

  protected $fillable = [
    'title',
    'type',
    'department',
    'location',
    'description',
    'link',
    'is_active'
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];
}
