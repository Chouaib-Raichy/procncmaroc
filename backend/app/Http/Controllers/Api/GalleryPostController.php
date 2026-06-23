<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryPost;
use App\Models\GalleryPostLike;
use App\DTOs\GalleryPostDTO;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryPostController extends Controller
{
    public function index()
    {
        $perPage = min((int) request('per_page', 9), 50);
        $paginator = GalleryPost::with('user:id,name,email,phone,business_location,avatar')
            ->withCount(['likes', 'comments'])
            ->when(auth()->check(), fn($q) => $q->addSelect([
                'is_liked_by_user' => GalleryPostLike::selectRaw('1')
                    ->whereColumn('gallery_post_id', 'gallery_posts.id')
                    ->where('user_id', auth()->id())
                    ->limit(1)
            ]))
            ->orderByRaw('(likes_count + comments_count) desc, created_at desc')
            ->paginate($perPage);

        return GalleryPostDTO::paginated($paginator);
    }

    public function myPosts(Request $request)
    {
        $posts = GalleryPost::with('user:id,name,email,phone,business_location,avatar')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return GalleryPostDTO::collection($posts);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'business_location' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:51200',
        ]);

        $paths = [];
        foreach ($request->file('images') as $img) {
            $paths[] = $img->store('gallery', 'public');
        }

        $post = GalleryPost::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'business_location' => $request->business_location,
            'contact_phone' => $request->contact_phone,
            'images' => $paths,
        ]);

        return response()->json(
            GalleryPostDTO::fromModel($post->load('user:id,name,email,phone,business_location,avatar'))->toArray(),
            201
        );
    }

    public function destroy(Request $request, GalleryPost $galleryPost)
    {
        if ($galleryPost->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        foreach (($galleryPost->images ?? []) as $img) {
            Storage::disk('public')->delete($img);
        }

        $galleryPost->delete();

        return response()->json(['message' => 'Post deleted']);
    }

    public function update(Request $request, GalleryPost $galleryPost)
    {
        if ($galleryPost->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'business_location' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'images' => 'nullable|array|min:1|max:5',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:51200',
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'business_location' => $request->business_location,
            'contact_phone' => $request->contact_phone,
        ];

        if ($request->hasFile('images')) {
            foreach (($galleryPost->images ?? []) as $img) {
                Storage::disk('public')->delete($img);
            }
            $paths = [];
            foreach ($request->file('images') as $img) {
                $paths[] = $img->store('gallery', 'public');
            }
            $data['images'] = $paths;
        }

        $galleryPost->update($data);

        return GalleryPostDTO::fromModel($galleryPost->load('user:id,name,email,phone,business_location,avatar'))->toArray();
    }

    public function adminIndex()
    {
        return GalleryPostDTO::collection(
            GalleryPost::with('user:id,name,email,phone,business_location,avatar')
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function adminTrashed()
    {
        return GalleryPostDTO::collection(
            GalleryPost::onlyTrashed()
                ->with('user:id,name,email,phone,business_location,avatar')
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function adminRestore(GalleryPost $galleryPost)
    {
        $galleryPost->restore();
        return GalleryPostDTO::fromModel($galleryPost->load('user:id,name,email,phone,business_location,avatar'))->toArray();
    }

    public function adminDestroy(GalleryPost $galleryPost)
    {
        foreach (($galleryPost->images ?? []) as $img) {
            Storage::disk('public')->delete($img);
        }

        $galleryPost->delete();

        return response()->json(['message' => 'Post deleted']);
    }
}
