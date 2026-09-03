<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EarningsController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TaskCatalogController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Marketing site's task browser, shown before sign-in.
Route::get('/catalog/tasks', [TaskCatalogController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Authenticated (Sanctum bearer token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/onboarding/step', [ProfileController::class, 'updateOnboardingStep']);
    Route::post('/profile/onboarding/complete', [ProfileController::class, 'completeOnboarding']);

    Route::get('/tasks', [TaskController::class, 'index']);
    Route::get('/tasks/mine', [TaskController::class, 'mine']);
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::post('/tasks/{task}/claim', [TaskController::class, 'claim']);
    Route::post('/assignments/{assignment}/submit', [TaskController::class, 'submit']);

    Route::get('/earnings', [EarningsController::class, 'index']);
});
