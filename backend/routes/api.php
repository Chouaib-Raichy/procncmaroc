<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\MachineController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google/redirect', [AuthController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);

Route::get('/machines', [MachineController::class, 'index']);
Route::get('/machines/{machine}', [MachineController::class, 'showPublic']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::middleware('admin')->group(function () {
        Route::get('/admin/machines', [MachineController::class, 'all']);
        Route::post('/admin/machines', [MachineController::class, 'store']);
        Route::get('/admin/machines/{machine}', [MachineController::class, 'show']);
        Route::post('/admin/machines/update/{machine}', [MachineController::class, 'update']);
        Route::delete('/admin/machines/{machine}', [MachineController::class, 'destroy']);

        Route::post('/admin/categories', [CategoryController::class, 'store']);
        Route::post('/admin/categories/update/{category}', [CategoryController::class, 'update']);
        Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy']);

        Route::get('/admin/messages', [ContactController::class, 'index']);
    });
});
