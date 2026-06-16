<?php
// app/Models/CMS/Setting.php

namespace App\Models\CMS;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
  protected $table = 'settings';

  protected $fillable = [
    'key',
    'value',
    'description'
  ];

  protected $casts = [
    'value' => 'array',
  ];

  // Helper to get a setting value
  public static function get($key, $default = null)
  {
    $setting = static::where('key', $key)->first();
    return $setting ? $setting->value : $default;
  }

  // Helper to set a setting value
  public static function set($key, $value, $description = null)
  {
    return static::updateOrCreate(
      ['key' => $key],
      ['value' => $value, 'description' => $description]
    );
  }
}
