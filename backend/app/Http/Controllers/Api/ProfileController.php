<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\UserDTO;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return UserDTO::fromModel($request->user())->toArray();
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|nullable|string|max:255',
            'email' => 'sometimes|nullable|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20|unique:users,phone,' . $user->id,
            'business_location' => 'sometimes|nullable|string|max:255',
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'password_confirmation' => 'sometimes|nullable|string',
            'avatar' => 'sometimes|file|mimes:jpeg,png,jpg,gif,webp|max:51200',
        ]);

        if ($request->filled('name')) $user->name = $request->name;
        if ($request->filled('email')) $user->email = $request->email;
        if ($request->filled('phone')) $user->phone = $request->phone;
        if ($request->filled('business_location')) {
            $user->business_location = $request->business_location;
            $coords = AuthController::geocode($request->business_location);
            $user->latitude = $coords['lat'];
            $user->longitude = $coords['lng'];
        }
        if ($request->filled('password')) $user->password = Hash::make($request->password);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) Storage::disk('public')->delete($user->avatar);
            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->save();

        return UserDTO::fromModel($user)->toArray();
    }

    public function completeRegistration(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'business_bio' => 'required|string|max:2000',
            'images' => 'sometimes|array|max:6',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:51200',
        ]);

        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $paths[] = $img->store('business-images', 'public');
            }
        }

        $user->business_bio = $request->business_bio;
        $user->business_images = !empty($paths) ? json_encode($paths) : null;
        $user->save();

        return response()->json([
            'message' => 'Registration submitted. Awaiting admin approval.',
            'user' => UserDTO::fromModel($user)->toArray(),
        ]);
    }
}
