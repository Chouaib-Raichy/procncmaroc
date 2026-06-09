<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Machine extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'description', 'image', 'visible', 'category_id', 'price', 'pdf', 'features'];

    protected $casts = [
        'visible'   => 'boolean',
        'price'     => 'decimal:2',
        'features'  => 'array',
        'deleted_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

}
