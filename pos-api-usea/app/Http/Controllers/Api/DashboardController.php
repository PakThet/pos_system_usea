<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Order;
use App\Models\Cashier;
use Exception;

class DashboardController extends ApiController
{
    public function stats()
    {
        try {
            $stats = [
                'totalCustomers' => Customer::count(),
                'totalProducts' => Product::count(),
                'totalSales' => Sale::count(),
                'totalOrders' => Order::count(),
                'totalCashiers' => Cashier::where('status', 'active')->count(),
                'totalRevenue' => (float) Sale::sum('total_amount'),
                'lowStockProducts' => Product::whereRaw('quantity <= quantity_alert')->count(),
                'pendingOrders' => Order::where('status', 'pending')->count(),
            ];

            return $this->success($stats, 'Dashboard stats fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}