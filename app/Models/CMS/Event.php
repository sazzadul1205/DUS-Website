<?php
// app/Models/CMS/Event.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
  protected $table = 'events';

  protected $fillable = [
    'title',
    'description',
    'location',
    'date_day',
    'date_month',
    'date_weekday',
    'date_day_number',
    'date_time',
    'link',
    'image',
    'is_active'
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];

  // Helper to get formatted date array (matches frontend)
  public function getDateArrayAttribute(): array
  {
    return [
      'day' => $this->date_day,
      'month' => $this->date_month,
      'weekday' => $this->date_weekday,
      'dayNumber' => $this->date_day_number,
      'time' => $this->date_time,
    ];
  }
}
