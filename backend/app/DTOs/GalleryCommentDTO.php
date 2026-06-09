<?php

namespace App\DTOs;

use App\Models\GalleryComment;
use Illuminate\Database\Eloquent\Model;

class GalleryCommentDTO extends DTO
{
    public function __construct(
        public readonly int $id,
        public readonly int $user_id,
        public readonly int $gallery_post_id,
        public readonly ?int $parent_id,
        public readonly string $body,
        public readonly int $likes_count,
        public readonly bool $is_liked_by_user,
        public readonly ?UserDTO $user,
        public readonly ?array $replies,
        public readonly string $created_at,
    ) {}

    public static function fromModel(Model $model): self
    {
        $comment = $model instanceof GalleryComment ? $model : GalleryComment::with('user', 'replies.user')->findOrFail($model->id);

        $user = null;
        if ($comment->relationLoaded('user') && $comment->user) {
            $user = UserDTO::fromModel($comment->user);
        }

        $replies = null;
        if ($comment->relationLoaded('replies')) {
            $replies = $comment->replies->map(fn($r) => self::fromModel($r)->toArray())->toArray();
        }

        return new self(
            id: $comment->id,
            user_id: $comment->user_id,
            gallery_post_id: $comment->gallery_post_id,
            parent_id: $comment->parent_id,
            body: $comment->body,
            likes_count: $comment->likes_count,
            is_liked_by_user: $comment->is_liked_by_user,
            user: $user,
            replies: $replies,
            created_at: $comment->created_at->toISOString(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'gallery_post_id' => $this->gallery_post_id,
            'parent_id' => $this->parent_id,
            'body' => $this->body,
            'likes_count' => $this->likes_count,
            'is_liked_by_user' => $this->is_liked_by_user,
            'user' => $this->user?->toArray(),
            'replies' => $this->replies,
            'created_at' => $this->created_at,
        ];
    }
}
