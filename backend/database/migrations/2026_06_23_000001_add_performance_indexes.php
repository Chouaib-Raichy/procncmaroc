<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('machines', function (Blueprint $table) {
            $table->index('visible');
            $table->index('created_at');
            $table->index(['visible', 'created_at']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('visible');
            $table->index('created_at');
            $table->index(['visible', 'created_at']);
        });

        Schema::table('gallery_posts', function (Blueprint $table) {
            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
        });

        Schema::table('gallery_comments', function (Blueprint $table) {
            $table->index('parent_id');
            $table->index(['gallery_post_id', 'parent_id']);
        });

        Schema::table('gallery_post_likes', function (Blueprint $table) {
            $table->index('gallery_post_id');
        });

        Schema::table('gallery_comment_likes', function (Blueprint $table) {
            $table->index('gallery_comment_id');
        });

        Schema::table('page_views', function (Blueprint $table) {
            $table->index('visited_at');
            $table->index('ip_address');
            $table->index(['visited_at', 'ip_address']);
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->index('created_at');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index('name');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('banned_at');
            $table->index('is_approved');
            $table->index(['is_approved', 'role', 'business_bio']);
        });
    }

    public function down(): void
    {
        Schema::table('machines', function (Blueprint $table) {
            $table->dropIndex(['visible']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['visible', 'created_at']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['visible']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['visible', 'created_at']);
        });

        Schema::table('gallery_posts', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['user_id', 'created_at']);
        });

        Schema::table('gallery_comments', function (Blueprint $table) {
            $table->dropIndex(['parent_id']);
            $table->dropIndex(['gallery_post_id', 'parent_id']);
        });

        Schema::table('gallery_post_likes', function (Blueprint $table) {
            $table->dropIndex(['gallery_post_id']);
        });

        Schema::table('gallery_comment_likes', function (Blueprint $table) {
            $table->dropIndex(['gallery_comment_id']);
        });

        Schema::table('page_views', function (Blueprint $table) {
            $table->dropIndex(['visited_at']);
            $table->dropIndex(['ip_address']);
            $table->dropIndex(['visited_at', 'ip_address']);
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['name']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['banned_at']);
            $table->dropIndex(['is_approved']);
            $table->dropIndex(['is_approved', 'role', 'business_bio']);
        });
    }
};
