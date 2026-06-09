<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

#[Fillable(['name', 'email', 'phone', 'business_location', 'latitude', 'longitude', 'password', 'role', 'avatar', 'is_approved', 'business_images', 'business_bio'])]
#[Hidden(['password', 'remember_token'])]
#[Appends(['avatar_url', 'business_images_url'])]
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, CanResetPassword;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_activity_at' => 'datetime',
            'banned_at' => 'datetime',
            'deleted_at' => 'datetime',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'password' => 'hashed',
            'is_approved' => 'boolean',
        ];
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    public function scopeActive($q)
    {
        return $q->whereNull('banned_at');
    }

    public function isBanned(): bool
    {
        return $this->banned_at !== null;
    }

    public function galleryPosts()
    {
        return $this->hasMany(GalleryPost::class);
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar ? url('storage/' . $this->avatar) : null;
    }

    public function getBusinessImagesUrlAttribute(): ?array
    {
        if (!$this->business_images) return null;
        $paths = json_decode($this->business_images, true);
        if (!is_array($paths)) return null;
        return array_map(fn($path) => url('storage/' . $path), $paths);
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new \App\Notifications\ResetPasswordNotification($token, $this->email));
    }
}
