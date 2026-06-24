<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\Product;

class SitemapController extends Controller
{
    public function index()
    {
        $staticUrls = [
            ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
            ['loc' => '/our-machines', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => '/products', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => '/about-us', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => '/contact-us', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => '/stories', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => '/partner-map', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => '/terms', 'priority' => '0.3', 'changefreq' => 'yearly'],
        ];

        $machines = Machine::where('visible', true)
            ->orderBy('updated_at', 'desc')
            ->get(['id', 'title', 'updated_at']);

        $products = Product::where('visible', true)
            ->orderBy('updated_at', 'desc')
            ->get(['id', 'title', 'updated_at']);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($staticUrls as $url) {
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>https://www.procncmaroc.com' . $url['loc'] . '</loc>' . "\n";
            $xml .= '    <priority>' . $url['priority'] . '</priority>' . "\n";
            $xml .= '    <changefreq>' . $url['changefreq'] . '</changefreq>' . "\n";
            $xml .= '  </url>' . "\n";
        }

        foreach ($machines as $machine) {
            $slug = $this->slugify($machine->title);
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>https://www.procncmaroc.com/machines/' . $slug . '-' . $machine->id . '</loc>' . "\n";
            $xml .= '    <priority>0.7</priority>' . "\n";
            $xml .= '    <changefreq>monthly</changefreq>' . "\n";
            $xml .= '    <lastmod>' . $machine->updated_at->toW3cString() . '</lastmod>' . "\n";
            $xml .= '  </url>' . "\n";
        }

        foreach ($products as $product) {
            $slug = $this->slugify($product->title);
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>https://www.procncmaroc.com/products/' . $slug . '-' . $product->id . '</loc>' . "\n";
            $xml .= '    <priority>0.6</priority>' . "\n";
            $xml .= '    <changefreq>monthly</changefreq>' . "\n";
            $xml .= '    <lastmod>' . $product->updated_at->toW3cString() . '</lastmod>' . "\n";
            $xml .= '  </url>' . "\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }

    private function slugify(string $text): string
    {
        $text = transliterator_transliterate('Any-Latin;Latin-ASCII;Lower()', $text);
        $text = preg_replace('/[^a-z0-9]+/', '-', $text);
        return trim($text, '-');
    }
}
