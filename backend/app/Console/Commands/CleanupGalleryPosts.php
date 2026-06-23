<?php

namespace App\Console\Commands;

use App\Models\GalleryPost;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupGalleryPosts extends Command
{
    protected $signature = 'gallery:cleanup';
    protected $description = 'Permanently delete gallery posts older than 15 days';

    public function handle()
    {
        GalleryPost::withTrashed()
            ->where('created_at', '<', now()->subDays(15))
            ->each(function ($post) {
                foreach (($post->images ?? []) as $img) {
                    Storage::disk('public')->delete($img);
                }
                $post->forceDelete();
            });

        $this->info('Old gallery posts cleaned up.');
        return Command::SUCCESS;
    }
}
