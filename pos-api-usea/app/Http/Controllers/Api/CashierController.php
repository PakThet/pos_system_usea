<?php

namespace App\Http\Controllers\Api;

use App\Models\Cashier;
use Exception;
use Illuminate\Http\Request;

class CashierController extends ApiController
{
    public function index()
    {
        try {
            $cashiers = Cashier::with('store')->get();
            return $this->success($cashiers, 'Cashiers fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'store_id' => 'required|exists:stores,id',
                'employee_id' => 'required|string|unique:cashiers,employee_id',
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:cashiers,email',
                'phone' => 'nullable|string',
                'avatar' => 'nullable|string',
                'status' => 'sometimes|in:active,inactive,on-break',
                'role' => 'sometimes|in:cashier,senior-cashier,head-cashier',
                'shift' => 'sometimes|in:morning,afternoon,evening,night',
                'hourly_rate' => 'required|numeric|min:0',
                'permissions' => 'nullable|array',
            ]);

            $cashier = Cashier::create($validated);
            return $this->success($cashier->load('store'), 'Cashier created successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function show(Cashier $cashier)
    {
        try {
            $cashier->load('store', 'sales', 'orders');
            return $this->success($cashier, 'Cashier fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function update(Request $request, Cashier $cashier)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:cashiers,email,' . $cashier->id,
                'phone' => 'nullable|string',
                'avatar' => 'nullable|string',
                'status' => 'sometimes|in:active,inactive,on-break',
                'role' => 'sometimes|in:cashier,senior-cashier,head-cashier',
                'shift' => 'sometimes|in:morning,afternoon,evening,night',
                'hourly_rate' => 'sometimes|numeric|min:0',
                'permissions' => 'nullable|array',
            ]);

            $cashier->update($validated);
            return $this->success($cashier->load('store'), 'Cashier updated successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function destroy(Cashier $cashier)
    {
        try {
            $cashier->delete();
            return $this->success(null, 'Cashier deleted successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function stats()
    {
        try {
            $stats = [
                'total' => Cashier::count(),
                'active' => Cashier::where('status', 'active')->count(),
                'onBreak' => Cashier::where('status', 'on-break')->count(),
                'totalSales' => (float) Cashier::sum('total_sales'),
                'totalTransactions' => Cashier::sum('total_transactions'),
                'averageTransaction' => Cashier::where('total_transactions', '>', 0)
                    ->avg('total_sales') / max(Cashier::avg('total_transactions'), 1),
            ];

            return $this->success($stats, 'Cashier stats fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}