<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GalleryPost extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'title', 'description', 'business_location', 'contact_phone', 'images'];

    protected $casts = [
        'images' => 'array',
        'deleted_at' => 'datetime',
    ];

    protected $appends = ['images_url', 'likes_count', 'is_liked_by_user', 'comments_count'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(GalleryComment::class, 'gallery_post_id');
    }

    public function likes()
    {
        return $this->hasMany(GalleryPostLike::class, 'gallery_post_id');
    }

    public function getImagesUrlAttribute(): array
    {
        $images = $this->images ?? [];
        return array_map(fn($img) => url('storage/' . $img), $images);
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

    public function getCommentsCountAttribute()
    {
        return $this->comments()->count();
    }
}
