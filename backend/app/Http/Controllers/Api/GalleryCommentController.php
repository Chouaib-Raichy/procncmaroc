<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryPost;
use App\Models\GalleryComment;
use App\Models\GalleryPostLike;
use App\Models\GalleryCommentLike;
use App\DTOs\GalleryCommentDTO;
use App\DTOs\UserDTO;
use Illuminate\Http\Request;

class GalleryCommentController extends Controller
{
    public function comments(GalleryPost $galleryPost)
    {
        $comments = $galleryPost->comments()
            ->with('user:id,name,avatar', 'replies.user:id,name,avatar')
            ->whereNull('parent_id')
            ->orderBy('created_at', 'desc')
            ->get();

        return GalleryCommentDTO::collection($comments);
    }

    public function store(Request $request, GalleryPost $galleryPost)
    {
        $request->validate(['body' => 'required|string|max:1000']);

        $comment = GalleryComment::create([
            'user_id' => $request->user()->id,
            'gallery_post_id' => $galleryPost->id,
            'body' => $request->body,
        ]);

        return response()->json(
            GalleryCommentDTO::fromModel($comment->load('user:id,name,avatar'))->toArray(),
            201
        );
    }

    public function reply(Request $request, GalleryComment $galleryComment)
    {
        $request->validate(['body' => 'required|string|max:1000']);

        $reply = GalleryComment::create([
            'user_id' => $request->user()->id,
            'gallery_post_id' => $galleryComment->gallery_post_id,
            'parent_id' => $galleryComment->id,
            'body' => $request->body,
        ]);

        return response()->json(
            GalleryCommentDTO::fromModel($reply->load('user:id,name,avatar'))->toArray(),
            201
        );
    }

    public function toggleLike(Request $request, GalleryPost $galleryPost)
    {
        $userId = $request->user()->id;
        $like = GalleryPostLike::withTrashed()
            ->where('user_id', $userId)
            ->where('gallery_post_id', $galleryPost->id)
            ->first();

        if ($like) {
            if ($like->trashed()) {
                $like->restore();
                return response()->json(['liked' => true, 'likes_count' => $galleryPost->likes()->count()]);
            }
            $like->delete();
            return response()->json(['liked' => false, 'likes_count' => $galleryPost->likes()->count()]);
        }

        GalleryPostLike::create(['user_id' => $userId, 'gallery_post_id' => $galleryPost->id]);
        return response()->json(['liked' => true, 'likes_count' => $galleryPost->likes()->count()]);
    }

    public function toggleCommentLike(Request $request, GalleryComment $galleryComment)
    {
        $userId = $request->user()->id;
        $like = GalleryCommentLike::withTrashed()
            ->where('user_id', $userId)
            ->where('gallery_comment_id', $galleryComment->id)
            ->first();

        if ($like) {
            if ($like->trashed()) {
                $like->restore();
                return response()->json(['liked' => true, 'likes_count' => $galleryComment->likes()->count()]);
            }
            $like->delete();
            return response()->json(['liked' => false, 'likes_count' => $galleryComment->likes()->count()]);
        }

        GalleryCommentLike::create(['user_id' => $userId, 'gallery_comment_id' => $galleryComment->id]);
        return response()->json(['liked' => true, 'likes_count' => $galleryComment->likes()->count()]);
    }

    public function likes(GalleryPost $galleryPost)
    {
        $users = $galleryPost->likes()->with('user:id,name,avatar')->get()->pluck('user');
        return UserDTO::collection($users);
    }
}
