<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PasswordResetCodeController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TourDestinationController;
use App\Http\Controllers\TourGuideController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetCodeController::class, 'sendCode']);
Route::post('/reset-password', [PasswordResetCodeController::class, 'reset']);

// Tour Guide routes (public - read only)
Route::get('/destinations', [TourDestinationController::class, 'index']);
Route::get('/destinations/{slug}', [TourDestinationController::class, 'show']);
Route::get('/tour-guides', [TourGuideController::class, 'index']);
Route::get('/tour-guides/{id}', [TourGuideController::class, 'show']);

// Contact Us route (public)
Route::post('/contact-messages', [ContactMessageController::class, 'store']);

// Protected routes (JWT authentication)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/photo', [AuthController::class, 'uploadProfilePhoto']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Payment routes
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
});

// Session routes (require authentication)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/session', [SessionController::class, 'getSession']);
    Route::post('/attendance', [SessionController::class, 'submitAttendance']);
});

// Admin-only routes
Route::middleware(['auth:api', 'check.admin'])->group(function () {
    Route::post('/session', [SessionController::class, 'createSession']);
    Route::put('/session', [SessionController::class, 'updateSession']);
    Route::post('/sessions', [SessionController::class, 'viewSessions']);
});

// Super Admin dashboard routes
Route::middleware(['auth:api', 'super.admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminDashboardController::class, 'users']);
    Route::get('/bookings', [AdminDashboardController::class, 'bookings']);
    Route::get('/payments', [AdminDashboardController::class, 'payments']);
});
