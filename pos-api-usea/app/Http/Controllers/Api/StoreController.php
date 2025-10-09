<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Exception;

class StoreController extends Controller
{
    // List all stores
    public function index()
    {
        try {
            $stores = Store::with('products')->get();
            return response()->json([
                'success' => true,
                'message' => 'Stores fetched successfully',
                'data' => $stores,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Store a new store
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:stores',
                'location' => 'nullable|string',
            ]);

            $store = Store::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Store created successfully',
                'data' => $store,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Show single store
    public function show(Store $store)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Store fetched successfully',
                'data' => $store->load('products'),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Update store
    public function update(Request $request, Store $store)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|unique:stores,name,' . $store->id,
                'location' => 'nullable|string',
            ]);

            $store->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Store updated successfully',
                'data' => $store,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Delete store
    public function destroy(Store $store)
    {
        try {
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
