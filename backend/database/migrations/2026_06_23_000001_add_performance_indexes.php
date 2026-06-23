<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->safeCreateIndex('machines', function (Blueprint $t) { $t->index('visible'); });
        $this->safeCreateIndex('machines', function (Blueprint $t) { $t->index('created_at'); });
        $this->safeCreateIndex('machines', function (Blueprint $t) { $t->index(['visible', 'created_at']); });

        $this->safeCreateIndex('products', function (Blueprint $t) { $t->index('visible'); });
        $this->safeCreateIndex('products', function (Blueprint $t) { $t->index('created_at'); });
        $this->safeCreateIndex('products', function (Blueprint $t) { $t->index(['visible', 'created_at']); });

        $this->safeCreateIndex('gallery_posts', function (Blueprint $t) { $t->index('created_at'); });
        $this->safeCreateIndex('gallery_posts', function (Blueprint $t) { $t->index(['user_id', 'created_at']); });

        $this->safeCreateIndex('gallery_comments', function (Blueprint $t) { $t->index('parent_id'); });
        $this->safeCreateIndex('gallery_comments', function (Blueprint $t) { $t->index(['gallery_post_id', 'parent_id']); });

        $this->safeCreateIndex('gallery_post_likes', function (Blueprint $t) { $t->index('gallery_post_id'); });

        $this->safeCreateIndex('gallery_comment_likes', function (Blueprint $t) { $t->index('gallery_comment_id'); });

        $this->safeCreateIndex('page_views', function (Blueprint $t) { $t->index('visited_at'); });
        $this->safeCreateIndex('page_views', function (Blueprint $t) { $t->index('ip_address'); });
        $this->safeCreateIndex('page_views', function (Blueprint $t) { $t->index(['visited_at', 'ip_address']); });

        $this->safeCreateIndex('contacts', function (Blueprint $t) { $t->index('created_at'); });

        $this->safeCreateIndex('categories', function (Blueprint $t) { $t->index('name'); });

        $this->safeCreateIndex('users', function (Blueprint $t) { $t->index('banned_at'); });
        $this->safeCreateIndex('users', function (Blueprint $t) { $t->index('is_approved'); });
        try {
            DB::statement('ALTER TABLE `users` ADD INDEX `users_is_approved_role_business_bio_index` (`is_approved`, `role`, `business_bio`(191))');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->errorInfo[1] !== 1061) throw $e;
        }
    }

    public function down(): void
    {
        // Intentionally no-op: removing indexes that may not exist is risky.
        // Use `php artisan migrate:rollback` only in dev with fresh DB.
    }

    private function safeCreateIndex(string $table, callable $callback): void
    {
        try {
            Schema::table($table, fn(Blueprint $t) => $callback($t));
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->errorInfo[1] !== 1061) throw $e;
        }
    }
};
