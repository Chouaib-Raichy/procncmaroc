<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = Cache::rememberForever('site_settings', fn() =>
            Setting::pluck('value', 'key')->toArray()
        );
        return response()->json($settings);
    }

    public function toggle(Request $request, $key)
    {
        $allowed = ['show_whatsapp', 'show_maps', 'show_email'];
        if (!in_array($key, $allowed)) {
            return response()->json(['message' => 'Invalid setting key'], 400);
        }

        $setting = Setting::find($key);
        $current = $setting ? $setting->value : '1';
        $new = $current === '1' ? '0' : '1';
        Setting::setValue($key, $new);

        Cache::forget('site_settings');

        return response()->json([
            'message' => 'Setting updated',
            'key' => $key,
            'value' => $new,
        ]);
    }
}
