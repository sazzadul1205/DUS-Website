<?php
// app/Models/CMS/Program.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
  protected $table = 'programs';

  protected $fillable = [
    'slug',
    'title',
    'breadcrumb',
    'excerpt',
    'full_content',
    'image',
    'bg_color',
    'order',
    'is_published'
  ];

  protected $casts = [
    'is_published' => 'boolean',
  ];
}
