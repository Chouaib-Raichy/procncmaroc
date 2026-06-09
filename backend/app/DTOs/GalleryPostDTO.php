<?php

namespace App\DTOs;

use App\Models\GalleryPost;
use Illuminate\Database\Eloquent\Model;

class GalleryPostDTO extends DTO
{
    public function __construct(
        public readonly int $id,
        public readonly int $user_id,
        public readonly string $title,
        public readonly string $description,
        public readonly string $business_location,
        public readonly string $contact_phone,
        public readonly array $images_url,
        public readonly int $likes_count,
        public readonly bool $is_liked_by_user,
        public readonly int $comments_count,
        public readonly ?UserDTO $user,
        public readonly string $created_at,
    ) {}

    public static function fromModel(Model $model): self
    {
        $post = $model instanceof GalleryPost ? $model : GalleryPost::with('user')->findOrFail($model->id);

        $user = null;
        if ($post->relationLoaded('user') && $post->user) {
            $user = UserDTO::fromModel($post->user);
        }

        return new self(
            id: $post->id,
            user_id: $post->user_id,
            title: $post->title,
            description: $post->description,
            business_location: $post->business_location,
            contact_phone: $post->contact_phone,
            images_url: $post->images_url,
            likes_count: $post->likes_count,
            is_liked_by_user: $post->is_liked_by_user,
            comments_count: $post->comments_count,
            user: $user,
            created_at: $post->created_at->toISOString(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'business_location' => $this->business_location,
            'contact_phone' => $this->contact_phone,
            'images_url' => $this->images_url,
            'likes_count' => $this->likes_count,
            'is_liked_by_user' => $this->is_liked_by_user,
            'comments_count' => $this->comments_count,
            'user' => $this->user?->toArray(),
            'created_at' => $this->created_at,
        ];
    }
}
