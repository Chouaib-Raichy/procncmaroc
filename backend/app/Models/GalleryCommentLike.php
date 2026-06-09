<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GalleryCommentLike extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'gallery_comment_id'];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comment()
    {
        return $this->belongsTo(GalleryComment::class, 'gallery_comment_id');
    }
}
