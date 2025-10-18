<?php

use App\Http\Controllers\Api\{
    StoreController,
    CategoryController,
    CashierController,
    CustomerController,
    CustomerAddressController,
    ProductController,
    SaleController,
    OrderController
};
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Store routes
Route::apiResource('stores', StoreController::class);

// Category routes
Route::apiResource('categories', CategoryController::class);

// Cashier routes
Route::apiResource('cashiers', CashierController::class);
Route::get('cashiers/stats', [CashierController::class, 'stats']);

// Customer routes
Route::apiResource('customers', CustomerController::class);
Route::get('/customers/{customer}/stats', [CustomerController::class, 'stats']);


// Customer address routes
Route::get('customers/{customerId}/addresses', [CustomerAddressController::class, 'index']);
Route::apiResource('addresses', CustomerAddressController::class)->except(['index']);

// Product routes
Route::apiResource('products', ProductController::class);
// Route::get('/products/{product}/low-stock', [ProductController::class, 'lowStock']);


// Sale routes
Route::apiResource('sales', SaleController::class);

// Order routes
Route::apiResource('orders', OrderController::class);

// Dashboard/analytics routes
Route::get('dashboard/stats', function () {
    return app()->make(\App\Http\Controllers\Api\DashboardController::class)->stats();
});
