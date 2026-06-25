<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'title', 'price', 'images', 'visible',
    ];

    protected $casts = [
        'price'   => 'decimal:2',
        'images'  => 'array',
        'visible' => 'boolean',
    ];

    public function getImagesUrlAttribute(): ?array
    {
        if (!$this->images || !is_array($this->images)) return null;
        return array_map(fn($path) => url('storage/' . $path), $this->images);
    }
}
