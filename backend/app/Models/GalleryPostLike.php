<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GalleryPostLike extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'gallery_post_id'];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(GalleryPost::class, 'gallery_post_id');
    }
}
