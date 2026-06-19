<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Machine;
use App\Models\Product;
use App\Models\GalleryPost;
use App\DTOs\UserDTO;
use App\DTOs\MachineDTO;
use App\DTOs\ProductDTO;
use App\DTOs\GalleryPostDTO;

class SearchController extends Controller
{
    public function search()
    {
        $q = request('q');

        if (!$q || strlen(trim($q)) < 2) {
            return response()->json([
                'users' => [],
                'machines' => [],
                'products' => [],
                'posts' => [],
            ]);
        }

        $q = trim($q);

        $users = User::whereNull('banned_at')
            ->where('role', '!=', 'admin')
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('entreprise_name', 'like', "%{$q}%")
                    ->orWhere('city', 'like', "%{$q}%")
                    ->orWhere('country', 'like', "%{$q}%")
                    ->orWhere('business_location', 'like', "%{$q}%");
            })
            ->limit(5)
            ->get();

        $machines = Machine::where('visible', true)
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            })
            ->with('category')
            ->limit(5)
            ->get();

        $products = Product::where('visible', true)
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            })
            ->limit(5)
            ->get();

        $posts = GalleryPost::where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            })
            ->with('user')
            ->limit(5)
            ->get();

        return response()->json([
            'users' => UserDTO::collection($users),
            'machines' => MachineDTO::collection($machines),
            'products' => ProductDTO::collection($products),
            'posts' => GalleryPostDTO::collection($posts),
        ]);
    }
}
