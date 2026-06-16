<?php
// app/Models/CMS/Section.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Section extends Model
{
  protected $table = 'sections';

  protected $fillable = [
    'page_id',
    'section_key',
    'component_name',
    'data',
    'custom_props',
    'order',
    'is_enabled'
  ];

  protected $casts = [
    'data' => 'array',
    'custom_props' => 'array',
    'is_enabled' => 'boolean',
  ];

  // Parent page
  public function page(): BelongsTo
  {
    return $this->belongsTo(Page::class);
  }
}
