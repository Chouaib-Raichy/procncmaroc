<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use App\Models\User;
use App\Models\Machine;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function trackVisit(Request $request)
    {
        $ip = $request->ip();
        $pageUrl = $request->input('page_url', '/');
        $userAgent = $request->header('User-Agent');
        $referrer = $request->input('referrer_url');

        PageView::create([
            'ip_address'   => $ip,
            'user_agent'   => $userAgent,
            'page_url'     => $pageUrl,
            'referrer_url' => $referrer,
            'visited_at'   => now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function getVisitors(Request $request)
    {
        $perPage = $request->input('per_page', 50);
        $visitors = PageView::orderBy('visited_at', 'desc')->paginate($perPage);

        return response()->json($visitors);
    }

    public function summary()
    {
        return Cache::remember('dashboard_summary', 300, function () {
            $totalUsers = User::count();
            $pendingUsers = User::where('is_approved', false)->where('role', 'user')->whereNotNull('business_bio')->count();
            $totalMachines = Machine::count();
            $totalMessages = Contact::count();
            $totalVisits = PageView::count();
            $visitsToday = PageView::whereDate('visited_at', today())->count();
            $uniqueVisitors = PageView::distinct('ip_address')->count('ip_address');

            $visitsPerDay = PageView::select(DB::raw('DATE(visited_at) as date'), DB::raw('count(*) as count'))
                ->where('visited_at', '>=', now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($r) => ['date' => $r->date, 'count' => $r->count]);

            return response()->json([
                'total_users' => $totalUsers,
                'pending_users' => $pendingUsers,
                'total_machines' => $totalMachines,
                'total_messages' => $totalMessages,
                'total_visits' => $totalVisits,
                'visits_today' => $visitsToday,
                'unique_visitors' => $uniqueVisitors,
                'visits_per_day' => $visitsPerDay,
            ])->getData();
        });
    }
}
