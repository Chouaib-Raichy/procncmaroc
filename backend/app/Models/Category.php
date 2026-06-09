<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    public function machines()
    {
        return $this->hasMany(Machine::class);
    }
}
