<?php

use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\MenuController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ReservationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Little Napoli
|--------------------------------------------------------------------------
| Base Version: v1
*/

Route::prefix('v1')->group(function () {
    // Health probe
    Route::get('/health', [HealthController::class, 'check']);

    // Menu endpoints
    Route::get('/menu/categories', [MenuController::class, 'categories']);
    Route::get('/menu/items', [MenuController::class, 'items']);
    Route::get('/menu/items/{slug}', [MenuController::class, 'show']);
    Route::post('/menu/upload', [MenuController::class, 'uploadImage']);

    // Order endpoints
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
    Route::get('/orders/{orderNumber}/receipt', [OrderController::class, 'printReceipt']);

    // Table reservation endpoints
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{reservationCode}', [ReservationController::class, 'show']);
});
