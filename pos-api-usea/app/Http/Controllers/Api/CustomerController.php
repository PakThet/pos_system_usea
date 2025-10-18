<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use Exception;
use Illuminate\Http\Request;

class CustomerController extends ApiController
{
    public function index()
    {
        try {
            $customers = Customer::with(['addresses'])->get();
            return $this->success($customers, 'Customers fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:customers,email',
                'phone' => 'nullable|string',
                'avatar' => 'nullable|string',
                'status' => 'sometimes|in:active,inactive',
                'tier' => 'sometimes|in:standard,premium,vip',
                'notes' => 'nullable|string',
            ]);

            $customer = Customer::create($validated);
            return $this->success($customer->load('addresses'), 'Customer created successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function show(Customer $customer)
    {
        try {
            $customer->load(['addresses', 'sales', 'orders']);
            return $this->success($customer, 'Customer fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function update(Request $request, Customer $customer)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:customers,email,' . $customer->id,
                'phone' => 'nullable|string',
                'avatar' => 'nullable|string',
                'status' => 'sometimes|in:active,inactive',
                'tier' => 'sometimes|in:standard,premium,vip',
                'notes' => 'nullable|string',
            ]);

            $customer->update($validated);
            return $this->success($customer->load('addresses'), 'Customer updated successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function destroy(Customer $customer)
    {
        try {
            $customer->delete();
            return $this->success(null, 'Customer deleted successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function stats()
    {
        try {
            $stats = [
                'total' => Customer::count(),
                'active' => Customer::where('status', 'active')->count(),
                'inactive' => Customer::where('status', 'inactive')->count(),
                'new_this_month' => Customer::whereMonth('created_at', now()->month)->count(),
                'premium' => Customer::where('tier', 'premium')->count(),
                'vip' => Customer::where('tier', 'vip')->count(),
                'average_order_value' => (float) Customer::avg('total_spent'),
                'tierDistribution' => [
                    'standard' => Customer::where('tier', 'standard')->count(),
                    'premium' => Customer::where('tier', 'premium')->count(),
                    'vip' => Customer::where('tier', 'vip')->count(),
                ],
            ];

            return $this->success($stats, 'Customer stats fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}