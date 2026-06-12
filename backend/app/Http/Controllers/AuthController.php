<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\DTOs\UserDTO;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'entreprise_name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20|unique:users',
            'business_location' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/[A-Z]/', 'regex:/[a-z]/', 'regex:/[0-9]/', 'regex:/[^A-Za-z0-9]/'],
        ]);

        $coords = self::geocode($request->business_location, $request->city, $request->country);

        $user = User::create([
            'name' => $request->name,
            'entreprise_name' => $request->entreprise_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'business_location' => $request->business_location,
            'city' => $request->city,
            'country' => $request->country,
            'latitude' => $coords['lat'],
            'longitude' => $coords['lng'],
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => UserDTO::fromModel($user)->toArray(),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!$token = JWTAuth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if ($user->isBanned()) {
            JWTAuth::setToken($token)->invalidate(true);
            return response()->json(['message' => 'Your account has been banned.'], 403);
        }

        $user->update(['last_activity_at' => now()]);

        return response()->json([
            'user' => UserDTO::fromModel($user)->toArray(),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->update(['last_activity_at' => null]);
        JWTAuth::parseToken()->invalidate(true);

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function profile(Request $request)
    {
        return UserDTO::fromModel($request->user())->toArray();
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        Password::sendResetLink($request->only('email'));

        return response()->json(['message' => 'If an account with that email exists, we have sent a password reset link.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/[A-Z]/', 'regex:/[a-z]/', 'regex:/[0-9]/', 'regex:/[^A-Za-z0-9]/'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            $user = User::where('email', $request->email)->first();
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Password reset successfully.',
                'user' => UserDTO::fromModel($user)->toArray(),
                'token' => $token,
            ]);
        }

        return response()->json(['message' => __($status)], 400);
    }

    public static function geocode(string $location, ?string $city = null, ?string $country = null): array
    {
        $coords = self::parseGoogleMapsUrl($location);
        if ($coords !== null) return $coords;

        $queries = array_filter([$location, trim("$city $country"), $country]);
        foreach ($queries as $q) {
            $result = self::nominatimGeocode($q);
            if ($result !== null) return $result;
        }

        return ['lat' => null, 'lng' => null];
    }

    private static function parseGoogleMapsUrl(string $url): ?array
    {
        if (!str_contains($url, 'google')) return null;

        if (preg_match('/@(-?\d+\.\d+),(-?\d+\.\d+)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }

        if (preg_match('/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }

        if (preg_match('/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }

        if (preg_match('#/place/[^@]+@(-?\d+\.\d+),(-?\d+\.\d+)#', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }

        return null;
    }

    private static function nominatimGeocode(string $query): ?array
    {
        try {
            $response = Http::withoutVerifying()
                ->withHeaders(['User-Agent' => 'PROCNCMAROC/1.0 (procncmaroc.com)'])
                ->timeout(5)->get('https://nominatim.openstreetmap.org/search', [
                'q' => $query,
                'format' => 'json',
                'limit' => 1,
            ]);
            $data = $response->json();
            if ($data && count($data) > 0) {
                return [
                    'lat' => (float) $data[0]['lat'],
                    'lng' => (float) $data[0]['lon'],
                ];
            }
        } catch (\Exception) {}
        return null;
    }
}
