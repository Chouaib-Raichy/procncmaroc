<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\UserDTO;
use App\Http\Controllers\AuthController;
use App\Notifications\VerificationCodeNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
            'city' => 'sometimes|nullable|string|max:100',
            'country' => 'sometimes|nullable|string|max:100',
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'password_confirmation' => 'sometimes|nullable|string',
            'avatar' => 'sometimes|file|mimes:jpeg,png,jpg,gif,webp|max:51200',
            'profile_bg' => 'sometimes|file|mimes:jpeg,png,jpg,gif,webp|max:51200',
        ]);

        if ($request->filled('name')) $user->name = $request->name;
        if ($request->filled('email')) $user->email = $request->email;
        if ($request->filled('phone')) $user->phone = $request->phone;
        if ($request->filled('business_location')) {
            $user->business_location = $request->business_location;
            $coords = AuthController::geocode($request->business_location, $request->city, $request->country);
            $user->latitude = $coords['lat'];
            $user->longitude = $coords['lng'];
        }
        if ($request->filled('city')) $user->city = $request->city;
        if ($request->filled('country')) $user->country = $request->country;
        if ($request->filled('password')) $user->password = Hash::make($request->password);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) Storage::disk('public')->delete($user->avatar);
            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        if ($request->hasFile('profile_bg')) {
            if ($user->profile_bg) Storage::disk('public')->delete($user->profile_bg);
            $user->profile_bg = $request->file('profile_bg')->store('profile-bgs', 'public');
        }

        $user->save();

        return UserDTO::fromModel($user)->toArray();
    }

    public function sendVerificationCode(Request $request)
    {
        $user = $request->user();
        $cacheKey = 'verification_code_' . $user->id;

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        Cache::put($cacheKey, $code, now()->addMinutes(10));

        $user->notify(new VerificationCodeNotification($code));

        return response()->json(['message' => 'Verification code sent to your email']);
    }

    public function updateWithVerification(Request $request)
    {
        $user = $request->user();
        $cacheKey = 'verification_code_' . $user->id;

        $request->validate([
            'code' => 'required|string|size:6',
            'name' => 'sometimes|nullable|string|max:255',
            'email' => 'sometimes|nullable|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20|unique:users,phone,' . $user->id,
            'business_location' => 'sometimes|nullable|string|max:255',
            'city' => 'sometimes|nullable|string|max:100',
            'country' => 'sometimes|nullable|string|max:100',
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'password_confirmation' => 'sometimes|nullable|string',
        ]);

        $cachedCode = Cache::get($cacheKey);
        if (!$cachedCode || $cachedCode !== $request->code) {
            return response()->json(['message' => 'Invalid or expired verification code.'], 422);
        }

        Cache::forget($cacheKey);

        if ($request->filled('name')) $user->name = $request->name;
        if ($request->filled('email')) $user->email = $request->email;
        if ($request->filled('phone')) $user->phone = $request->phone;
        if ($request->filled('business_location')) {
            $user->business_location = $request->business_location;
            $coords = AuthController::geocode($request->business_location, $request->city, $request->country);
            $user->latitude = $coords['lat'];
            $user->longitude = $coords['lng'];
        }
        if ($request->filled('city')) $user->city = $request->city;
        if ($request->filled('country')) $user->country = $request->country;
        if ($request->filled('password')) $user->password = Hash::make($request->password);

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
