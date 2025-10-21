<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Exception;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Store::query();

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $stores = $query->paginate($perPage);

            return response()->json([
                "success" => true,
                "message" => "Stores fetched successfully",
                "data" => $stores,
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
                'name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
            ]);

            $store = Store::create($validated);

            return response()->json([
                "success" => true,
                "message" => "Store created successfully",
                "data" => $store,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Store $store)
    {
        try {
            return response()->json([
                "success" => true,
                "message" => "Store fetched successfully",
                "data" => $store,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, Store $store)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'location' => 'sometimes|string|max:255',
            ]);

            $store->update($validated);

            return response()->json([
                "success" => true,
                "message" => "Store updated successfully",
                "data" => $store,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Store $store)
    {
        try {
            // Check if store has associated data
            if ($store->products()->exists() || $store->sales()->exists() || $store->orders()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete store with associated products, sales, or orders',
                ], 422);
            }

            $store->delete();

            return response()->json([
                'success' => true,
                'message' => 'Store deleted successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}