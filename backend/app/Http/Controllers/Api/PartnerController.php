<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\DTOs\UserDTO;

class PartnerController extends Controller
{
    public function index()
    {
        $users = User::whereNotNull('business_location')
            ->whereNull('banned_at')
            ->where('role', '!=', 'admin')
            ->orderBy('name')
            ->get();

        return response()->json(UserDTO::collection($users));
    }

    public function show($id)
    {
        $user = User::whereNull('banned_at')->findOrFail($id);

        return response()->json([
            'user' => UserDTO::fromModel($user)->toArray(),
            'posts_count' => $user->galleryPosts()->count(),
        ]);
    }
}
