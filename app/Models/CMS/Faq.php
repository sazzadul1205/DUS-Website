<?php
// app/Models/CMS/Faq.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
  protected $table = 'faqs';

  protected $fillable = [
    'page_slug',
    'question',
    'answer',
    'order',
    'is_active'
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];
}
