<?php
// app/Models/CMS/Story.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
  protected $table = 'stories';

  protected $fillable = [
    'title',
    'description',
    'image',
    'date',
    'link',
    'order',
    'is_active'
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];
}
