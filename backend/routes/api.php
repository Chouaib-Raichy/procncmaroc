<?php

use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\GalleryCommentController;
use App\Http\Controllers\Api\GalleryPostController;
use App\Http\Controllers\Api\MachineController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap', [App\Http\Controllers\SitemapController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/machines', [MachineController::class, 'index']);
Route::get('/machines/{machine}', [MachineController::class, 'showPublic']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/gallery', [GalleryPostController::class, 'index']);
Route::get('/partners', [App\Http\Controllers\Api\PartnerController::class, 'index']);
Route::get('/partners/{id}', [App\Http\Controllers\Api\PartnerController::class, 'show']);
Route::post('/track-visit', [StatsController::class, 'trackVisit']);
Route::get('/resolve-url', [AuthController::class, 'resolveLocation']);
Route::get('/settings', [SiteSettingController::class, 'index']);
Route::get('/search', [SearchController::class, 'search']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::post('/profile/send-code', [ProfileController::class, 'sendVerificationCode']);
    Route::post('/profile/update-verified', [ProfileController::class, 'updateWithVerification']);
    Route::post('/register/complete', [ProfileController::class, 'completeRegistration']);
    Route::get('/gallery/my', [GalleryPostController::class, 'myPosts']);
    Route::post('/gallery', [GalleryPostController::class, 'store']);
    Route::post('/gallery/{galleryPost}/update', [GalleryPostController::class, 'update']);
    Route::delete('/gallery/{galleryPost}', [GalleryPostController::class, 'destroy']);
    Route::get('/gallery/{galleryPost}/comments', [GalleryCommentController::class, 'comments']);
    Route::post('/gallery/{galleryPost}/comments', [GalleryCommentController::class, 'store']);
    Route::post('/gallery/{galleryPost}/like', [GalleryCommentController::class, 'toggleLike']);
    Route::get('/gallery/{galleryPost}/likes', [GalleryCommentController::class, 'likes']);
    Route::post('/gallery/comments/{galleryComment}/reply', [GalleryCommentController::class, 'reply']);
    Route::post('/gallery/comments/{galleryComment}/like', [GalleryCommentController::class, 'toggleCommentLike']);

    Route::middleware('admin')->group(function () {
        Route::get('/admin/machines', [MachineController::class, 'all']);
        Route::get('/admin/machines/trashed', [MachineController::class, 'trashed']);
        Route::post('/admin/machines/{machine}/restore', [MachineController::class, 'restore']);
        Route::post('/admin/machines', [MachineController::class, 'store']);
        Route::get('/admin/machines/{machine}', [MachineController::class, 'show']);
        Route::post('/admin/machines/update/{machine}', [MachineController::class, 'update']);
        Route::delete('/admin/machines/{machine}', [MachineController::class, 'destroy']);

        Route::post('/admin/categories', [CategoryController::class, 'store']);
        Route::post('/admin/categories/update/{category}', [CategoryController::class, 'update']);
        Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy']);
        Route::post('/admin/categories/{category}/restore', [CategoryController::class, 'restore']);

        Route::get('/admin/messages', [ContactController::class, 'index']);

        Route::get('/admin/visitors', [StatsController::class, 'getVisitors']);
        Route::get('/admin/stats/summary', [StatsController::class, 'summary']);

        Route::get('/admin/gallery', [GalleryPostController::class, 'adminIndex']);
        Route::get('/admin/gallery/trashed', [GalleryPostController::class, 'adminTrashed']);
        Route::post('/admin/gallery/{galleryPost}/restore', [GalleryPostController::class, 'adminRestore']);
        Route::delete('/admin/gallery/{galleryPost}', [GalleryPostController::class, 'adminDestroy']);

        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::get('/admin/users/{id}', [AdminUserController::class, 'show']);
        Route::post('/admin/users/{id}/update', [AdminUserController::class, 'update']);
        Route::post('/admin/users/{id}/toggle-ban', [AdminUserController::class, 'toggleBan']);
        Route::post('/admin/users/{id}/restore', [AdminUserController::class, 'restore']);
        Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);
        Route::get('/admin/users/pending/list', [AdminUserController::class, 'pending']);
        Route::post('/admin/users/{id}/approve', [AdminUserController::class, 'approve']);
        Route::delete('/admin/users/{id}/reject', [AdminUserController::class, 'reject']);

        Route::post('/admin/settings/{key}/toggle', [SiteSettingController::class, 'toggle']);

        Route::get('/admin/products', [ProductController::class, 'all']);
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::post('/admin/products/update/{product}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{product}', [ProductController::class, 'destroy']);
    });
});
