<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\DTOs\UserDTO;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        $query = User::withTrashed()->orderBy('created_at', 'desc');

        if ($perPage = request('per_page')) {
            $paginator = $query->paginate($perPage);
            return UserDTO::paginated($paginator);
        }

        return UserDTO::collection($query->get());
    }

    public function show($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        return response()->json([
            'user' => UserDTO::fromModel($user)->toArray(),
        ]);
    }

    public function toggleBan($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        if ($user->isBanned()) {
            $user->update(['banned_at' => null]);
            $message = 'User unbanned';
        } else {
            $user->update(['banned_at' => now()]);
            $message = 'User banned';
        }

        return response()->json([
            'message' => $message,
            'user' => UserDTO::fromModel($user)->toArray(),
        ]);
    }

    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        return response()->json([
            'message' => 'User restored',
            'user' => UserDTO::fromModel($user)->toArray(),
        ]);
    }

    public function pending(Request $request)
    {
        $users = User::where('is_approved', false)
            ->where('role', 'user')
            ->whereNotNull('business_bio')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return UserDTO::paginated($users);
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_approved' => true]);

        return response()->json([
            'message' => 'User approved',
            'user' => UserDTO::fromModel($user)->toArray(),
        ]);
    }

    public function reject($id)
    {
        $user = User::findOrFail($id);
        if ($user->business_images) {
            $paths = json_decode($user->business_images, true);
            if (is_array($paths)) {
                foreach ($paths as $path) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
                }
            }
        }
        $user->forceDelete();

        return response()->json(['message' => 'User rejected and account deleted']);
    }

    public function update(Request $request, $id)
    {
        $user = User::withTrashed()->findOrFail($id);

        $data = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'email'            => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone'            => 'sometimes|string|max:20|unique:users,phone,' . $id,
            'business_location' => 'sometimes|string|max:255',
            'city'             => 'sometimes|string|max:100',
            'country'          => 'sometimes|string|max:100',
            'entreprise_name'  => 'nullable|string|max:255',
            'business_bio'     => 'nullable|string',
            'role'             => 'sometimes|string|in:user,admin',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => UserDTO::fromModel($user)->toArray(),
        ]);
    }

    public function destroy($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        if ($user->business_images) {
            $paths = json_decode($user->business_images, true);
            if (is_array($paths)) {
                foreach ($paths as $path) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
                }
            }
        }

        if ($user->trashed()) {
            $user->forceDelete();
        } else {
            $user->delete();
        }

        return response()->json(['message' => 'User deleted successfully']);
    }
}
