<?php

namespace App\Console\Commands;

use App\Models\GalleryPost;
use App\Models\Machine;
use App\Models\User;
use Illuminate\Console\Command;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate {--path= : Output file path}';
    protected $description = 'Generate the sitemap.xml with all indexable pages';

    public function handle()
    {
        $baseUrl = 'https://www.procncmaroc.com';

        $static = [
            ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
            ['loc' => '/our-machines', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => '/products', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => '/stories', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => '/about-us', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => '/contact-us', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => '/partner-map', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => '/terms', 'priority' => '0.3', 'changefreq' => 'yearly'],
        ];

        $machines = Machine::where('visible', true)->get()->map(fn($m) => [
            'loc' => '/machines/' . $m->id,
            'priority' => '0.7',
            'changefreq' => 'monthly',
            'lastmod' => $m->updated_at?->toDateString(),
        ]);

        $posts = GalleryPost::whereNull('deleted_at')->get()->map(fn($p) => [
            'loc' => '/stories',
            'priority' => '0.6',
            'changefreq' => 'weekly',
            'lastmod' => $p->updated_at?->toDateString(),
        ]);

        $profiles = User::where('is_approved', true)->whereNull('banned_at')->whereNull('deleted_at')->get()->map(fn($u) => [
            'loc' => '/profile/' . $u->id,
            'priority' => '0.5',
            'changefreq' => 'monthly',
            'lastmod' => $u->updated_at?->toDateString(),
        ]);

        $urls = collect($static)
            ->concat($machines)
            ->concat($posts)
            ->concat($profiles)
            ->unique('loc')
            ->sortByDesc('priority');

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$baseUrl}{$url['loc']}</loc>\n";
            if (!empty($url['lastmod'])) {
                $xml .= "    <lastmod>{$url['lastmod']}</lastmod>\n";
            }
            $xml .= "    <priority>{$url['priority']}</priority>\n";
            $xml .= "    <changefreq>{$url['changefreq']}</changefreq>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>' . "\n";

        $path = $this->option('path');
        if ($path) {
            file_put_contents($path, $xml);
            $this->info("Sitemap written to {$path}");
        } else {
            $this->output->write($xml);
        }

        return Command::SUCCESS;
    }
}
