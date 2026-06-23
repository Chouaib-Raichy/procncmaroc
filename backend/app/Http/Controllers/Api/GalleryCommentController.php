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
            ->withCount('likes')
            ->when(auth()->check(), function ($q) {
                $userId = auth()->id();
                $q->addSelect([
                    'is_liked_by_user' => GalleryCommentLike::selectRaw('1')
                        ->whereColumn('gallery_comment_id', 'gallery_comments.id')
                        ->where('user_id', $userId)
                        ->limit(1)
                ]);
                $q->with(['replies' => fn($r) => $r->withCount('likes')
                    ->addSelect([
                        'is_liked_by_user' => GalleryCommentLike::selectRaw('1')
                            ->whereColumn('gallery_comment_id', 'gallery_comments.id')
                            ->where('user_id', $userId)
                            ->limit(1)
                    ])
                ]);
            })
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
                $count = GalleryPostLike::where('gallery_post_id', $galleryPost->id)->count();
                return response()->json(['liked' => true, 'likes_count' => $count]);
            }
            $like->delete();
            $count = GalleryPostLike::where('gallery_post_id', $galleryPost->id)->count();
            return response()->json(['liked' => false, 'likes_count' => $count]);
        }

        GalleryPostLike::create(['user_id' => $userId, 'gallery_post_id' => $galleryPost->id]);
        $count = GalleryPostLike::where('gallery_post_id', $galleryPost->id)->count();
        return response()->json(['liked' => true, 'likes_count' => $count]);
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
                $count = GalleryCommentLike::where('gallery_comment_id', $galleryComment->id)->count();
                return response()->json(['liked' => true, 'likes_count' => $count]);
            }
            $like->delete();
            $count = GalleryCommentLike::where('gallery_comment_id', $galleryComment->id)->count();
            return response()->json(['liked' => false, 'likes_count' => $count]);
        }

        GalleryCommentLike::create(['user_id' => $userId, 'gallery_comment_id' => $galleryComment->id]);
        $count = GalleryCommentLike::where('gallery_comment_id', $galleryComment->id)->count();
        return response()->json(['liked' => true, 'likes_count' => $count]);
    }

    public function likes(GalleryPost $galleryPost)
    {
        $users = $galleryPost->likes()->with('user:id,name,avatar')->get()->pluck('user');
        return UserDTO::collection($users);
    }
}
