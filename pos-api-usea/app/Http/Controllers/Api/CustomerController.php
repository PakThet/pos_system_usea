<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerAddress;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Customer::with(['addresses']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by tier
            if ($request->has('tier')) {
                $query->where('tier', $request->tier);
            }

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $customers = $query->paginate($perPage);

            // Convert avatar paths to full URLs
            $customers->getCollection()->transform(function ($customer) {
                if ($customer->avatar) {
                    $customer->avatar = $this->getImageUrl($customer->avatar);
                }
                return $customer;
            });

            return response()->json([
                "success" => true,
                "message" => "Customers fetched successfully",
                "data" => $customers,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:customers',
                'phone' => 'nullable|string',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'status' => 'sometimes|in:active,inactive',
                'tier' => 'sometimes|in:standard,premium,vip',
                'notes' => 'nullable|string',
                'address' => 'sometimes|array',
                'address.street' => 'required_with:address|string',
                'address.city' => 'required_with:address|string',
                'address.state' => 'required_with:address|string',
                'address.zip_code' => 'required_with:address|string',
                'address.country' => 'required_with:address|string',
            ]);

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                $validated['avatar'] = $this->storeImage($request->file('avatar'), 'customers');
            }

            $customer = Customer::create($validated);

            // Create address if provided
            if ($request->has('address')) {
                $addressData = $request->address;
                $addressData['customer_id'] = $customer->id;
                $addressData['type'] = 'shipping';
                $addressData['is_default'] = true;
                
                CustomerAddress::create($addressData);
            }

            $customer->load('addresses');

            // Convert avatar path to full URL
            if ($customer->avatar) {
                $customer->avatar = $this->getImageUrl($customer->avatar);
            }

            return response()->json([
                "success" => true,
                "message" => "Customer created successfully",
                "data" => $customer,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Customer $customer)
    {
        try {
            $customer->load('addresses');

            // Convert avatar path to full URL
            if ($customer->avatar) {
                $customer->avatar = $this->getImageUrl($customer->avatar);
            }

            return response()->json([
                "success" => true,
                "message" => "Customer fetched successfully",
                "data" => $customer,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
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
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'sometimes|in:active,inactive',
            'tier' => 'sometimes|in:standard,premium,vip',
            'notes' => 'nullable|string',
            'address' => 'sometimes|array',
            'address.street' => 'required_with:address|string',
            'address.city' => 'required_with:address|string',
            'address.state' => 'required_with:address|string',
            'address.zip_code' => 'required_with:address|string',
            'address.country' => 'required_with:address|string',
        ]);

        // ✅ Handle avatar upload
        if ($request->hasFile('avatar')) {
            if ($customer->avatar) {
                $this->deleteImage($customer->avatar);
            }
            $validated['avatar'] = $this->storeImage($request->file('avatar'), 'customers');
        }

        // ✅ Update customer basic info
        $customer->update($validated);

        // ✅ Handle address (create or update)
        if ($request->has('address')) {
            $addressData = $request->address;
            $existingAddress = $customer->addresses()->first();

            if ($existingAddress) {
                $existingAddress->update($addressData);
            } else {
                $customer->addresses()->create($addressData);
            }
        }

        // ✅ Reload addresses relation
        $customer->load('addresses');

        // ✅ Convert avatar path to full URL
        if ($customer->avatar) {
            $customer->avatar = $this->getImageUrl($customer->avatar);
        }

        return response()->json([
            "success" => true,
            "message" => "Customer updated successfully",
            "data" => $customer,
        ]);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}


    public function destroy(Customer $customer)
    {
        try {
            // Delete associated avatar
            if ($customer->avatar) {
                $this->deleteImage($customer->avatar);
            }

            $customer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Customer deleted successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
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
                'average_order_value' => Customer::avg('total_spent') / max(Customer::avg('total_orders'), 1),
                'tier_distribution' => [
                    'standard' => Customer::where('tier', 'standard')->count(),
                    'premium' => Customer::where('tier', 'premium')->count(),
                    'vip' => Customer::where('tier', 'vip')->count(),
                ],
            ];

            return response()->json([
                "success" => true,
                "message" => "Customer stats fetched successfully",
                "data" => $stats,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function storeImage($image, $folder = 'customers')
    {
        return $image->store($folder, 'public');
    }

    private function getImageUrl($path)
    {
        return asset('storage/' . $path);
    }

    private function deleteImage($path)
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}