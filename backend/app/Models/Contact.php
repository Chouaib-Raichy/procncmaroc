<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use SoftDeletes;

    protected $fillable = ['first_name', 'last_name', 'email', 'message'];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];
}
