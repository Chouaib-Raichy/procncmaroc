<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GalleryComment extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'gallery_post_id', 'parent_id', 'body'];

    protected $appends = ['likes_count', 'is_liked_by_user'];

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

    public function replies()
    {
        return $this->hasMany(GalleryComment::class, 'parent_id');
    }

    public function likes()
    {
        return $this->hasMany(GalleryCommentLike::class, 'gallery_comment_id');
    }

    public function getLikesCountAttribute()
    {
        return $this->likes()->count();
    }

    public function getIsLikedByUserAttribute()
    {
        $userId = request()->user()?->id;
        if (!$userId) return false;
        return $this->likes()->where('user_id', $userId)->exists();
    }
}
