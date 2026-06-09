<?php

namespace App\DTOs;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class UserDTO extends DTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly ?string $email,
        public readonly ?string $phone,
        public readonly ?string $business_location,
        public readonly ?string $city,
        public readonly ?string $country,
        public readonly ?float $latitude,
        public readonly ?float $longitude,
        public readonly ?string $role,
        public readonly ?string $avatar_url,
        public readonly ?string $profile_bg_url,
        public readonly bool $is_approved,
        public readonly ?array $business_images_url,
        public readonly ?string $business_bio,

        public readonly ?string $last_activity_at,
        public readonly ?string $banned_at,
        public readonly ?string $created_at,
    ) {}

    public static function fromModel(Model $model): self
    {
        $user = $model instanceof User ? $model : User::findOrFail($model->id);

        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            phone: $user->phone,
            business_location: $user->business_location,
            city: $user->city,
            country: $user->country,
            latitude: $user->latitude,
            longitude: $user->longitude,
            role: $user->role,
            avatar_url: $user->avatar_url,
            profile_bg_url: $user->profile_bg_url,
            is_approved: $user->is_approved ?? false,
            business_images_url: $user->business_images_url,
            business_bio: $user->business_bio,

            last_activity_at: $user->last_activity_at?->toISOString(),
            banned_at: $user->banned_at?->toISOString(),
            created_at: $user->created_at?->toISOString(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'business_location' => $this->business_location,
            'city' => $this->city,
            'country' => $this->country,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'role' => $this->role,
            'avatar_url' => $this->avatar_url,
            'profile_bg_url' => $this->profile_bg_url,
            'is_approved' => $this->is_approved,
            'business_images_url' => $this->business_images_url,
            'business_bio' => $this->business_bio,

            'last_activity_at' => $this->last_activity_at,
            'banned_at' => $this->banned_at,
            'created_at' => $this->created_at,
        ];
    }
}
