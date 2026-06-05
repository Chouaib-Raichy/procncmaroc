<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Machine extends Model
{
    protected $fillable = ['title', 'description', 'image', 'visible', 'category_id', 'price', 'pdf', 'features'];

    protected $casts = [
        'visible'   => 'boolean',
        'price'     => 'decimal:2',
        'features'  => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
