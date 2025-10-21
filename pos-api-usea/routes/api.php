<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    // Users
    Route::apiResource('users', UserController::class);
    Route::get('users/stats', [UserController::class, 'stats']);

    // Customers
    Route::get('customers/stats', [CustomerController::class, 'stats']);
    Route::apiResource('customers', CustomerController::class);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Stores
    Route::apiResource('stores', StoreController::class);

    // Products
    Route::apiResource('products', ProductController::class);
    Route::get('products/low-stock', [ProductController::class, 'lowStock']);
    Route::get('products/search', [ProductController::class, 'search']);

    // Sales
    Route::get('sales/stats', [SaleController::class, 'stats']);
    Route::patch('sales/{sale}/status', [SaleController::class, 'updateStatus']);
    Route::apiResource('sales', SaleController::class);

    // Orders
    Route::apiResource('orders', OrderController::class);
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::patch('orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus']);
    Route::get('orders/stats', [OrderController::class, 'stats']);
});