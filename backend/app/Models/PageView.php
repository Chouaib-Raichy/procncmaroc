<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    protected $fillable = [
        'ip_address', 'user_agent', 'page_url', 'referrer_url',
        'city', 'country', 'latitude', 'longitude', 'visited_at',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
        'latitude' => 'float',
        'longitude' => 'float',
    ];
}
