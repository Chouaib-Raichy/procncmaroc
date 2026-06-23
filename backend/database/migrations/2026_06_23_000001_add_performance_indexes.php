<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->dropIndexIfExists('machines', 'machines_visible_index');
        $this->dropIndexIfExists('machines', 'machines_created_at_index');
        $this->dropIndexIfExists('machines', 'machines_visible_created_at_index');
        Schema::table('machines', function (Blueprint $table) {
            $table->index('visible');
            $table->index('created_at');
            $table->index(['visible', 'created_at']);
        });

        $this->dropIndexIfExists('products', 'products_visible_index');
        $this->dropIndexIfExists('products', 'products_created_at_index');
        $this->dropIndexIfExists('products', 'products_visible_created_at_index');
        Schema::table('products', function (Blueprint $table) {
            $table->index('visible');
            $table->index('created_at');
            $table->index(['visible', 'created_at']);
        });

        $this->dropIndexIfExists('gallery_posts', 'gallery_posts_created_at_index');
        $this->dropIndexIfExists('gallery_posts', 'gallery_posts_user_id_created_at_index');
        Schema::table('gallery_posts', function (Blueprint $table) {
            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
        });

        $this->dropIndexIfExists('gallery_comments', 'gallery_comments_parent_id_index');
        $this->dropIndexIfExists('gallery_comments', 'gallery_comments_gallery_post_id_parent_id_index');
        Schema::table('gallery_comments', function (Blueprint $table) {
            $table->index('parent_id');
            $table->index(['gallery_post_id', 'parent_id']);
        });

        $this->dropIndexIfExists('gallery_post_likes', 'gallery_post_likes_gallery_post_id_index');
        Schema::table('gallery_post_likes', function (Blueprint $table) {
            $table->index('gallery_post_id');
        });

        $this->dropIndexIfExists('gallery_comment_likes', 'gallery_comment_likes_gallery_comment_id_index');
        Schema::table('gallery_comment_likes', function (Blueprint $table) {
            $table->index('gallery_comment_id');
        });

        $this->dropIndexIfExists('page_views', 'page_views_visited_at_index');
        $this->dropIndexIfExists('page_views', 'page_views_ip_address_index');
        $this->dropIndexIfExists('page_views', 'page_views_visited_at_ip_address_index');
        Schema::table('page_views', function (Blueprint $table) {
            $table->index('visited_at');
            $table->index('ip_address');
            $table->index(['visited_at', 'ip_address']);
        });

        $this->dropIndexIfExists('contacts', 'contacts_created_at_index');
        Schema::table('contacts', function (Blueprint $table) {
            $table->index('created_at');
        });

        $this->dropIndexIfExists('categories', 'categories_name_index');
        Schema::table('categories', function (Blueprint $table) {
            $table->index('name');
        });

        $this->dropIndexIfExists('users', 'users_banned_at_index');
        $this->dropIndexIfExists('users', 'users_is_approved_index');
        Schema::table('users', function (Blueprint $table) {
            $table->index('banned_at');
            $table->index('is_approved');
        });
        $this->dropIndexIfExists('users', 'users_is_approved_role_business_bio_index');
        DB::statement('ALTER TABLE `users` ADD INDEX `users_is_approved_role_business_bio_index` (`is_approved`, `role`, `business_bio`(191))');
    }

    public function down(): void
    {
        $this->dropIndexIfExists('machines', 'machines_visible_index');
        $this->dropIndexIfExists('machines', 'machines_created_at_index');
        $this->dropIndexIfExists('machines', 'machines_visible_created_at_index');

        $this->dropIndexIfExists('products', 'products_visible_index');
        $this->dropIndexIfExists('products', 'products_created_at_index');
        $this->dropIndexIfExists('products', 'products_visible_created_at_index');

        $this->dropIndexIfExists('gallery_posts', 'gallery_posts_created_at_index');
        $this->dropIndexIfExists('gallery_posts', 'gallery_posts_user_id_created_at_index');

        $this->dropIndexIfExists('gallery_comments', 'gallery_comments_parent_id_index');
        $this->dropIndexIfExists('gallery_comments', 'gallery_comments_gallery_post_id_parent_id_index');

        $this->dropIndexIfExists('gallery_post_likes', 'gallery_post_likes_gallery_post_id_index');

        $this->dropIndexIfExists('gallery_comment_likes', 'gallery_comment_likes_gallery_comment_id_index');

        $this->dropIndexIfExists('page_views', 'page_views_visited_at_index');
        $this->dropIndexIfExists('page_views', 'page_views_ip_address_index');
        $this->dropIndexIfExists('page_views', 'page_views_visited_at_ip_address_index');

        $this->dropIndexIfExists('contacts', 'contacts_created_at_index');

        $this->dropIndexIfExists('categories', 'categories_name_index');

        $this->dropIndexIfExists('users', 'users_banned_at_index');
        $this->dropIndexIfExists('users', 'users_is_approved_index');
        $this->dropIndexIfExists('users', 'users_is_approved_role_business_bio_index');
    }

    private function dropIndexIfExists(string $table, string $index): void
    {
        try {
            Schema::table($table, fn(Blueprint $t) => $t->dropIndex($index));
        } catch (\Illuminate\Database\QueryException $e) {
            // index didn't exist, that's fine
        }
    }
};
