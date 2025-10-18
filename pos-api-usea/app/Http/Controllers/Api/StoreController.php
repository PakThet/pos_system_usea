<?php

namespace App\Http\Controllers\Api;

use App\Models\Store;
use Exception;
use Illuminate\Http\Request;

class StoreController extends ApiController
{
    public function index()
    {
        try {
            $stores = Store::all();
            return $this->success($stores, 'Stores fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'location' => 'required|string',
            ]);

            $store = Store::create($validated);
            return $this->success($store, 'Store created successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function show(Store $store)
    {
        try {
            return $this->success($store, 'Store fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function update(Request $request, Store $store)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'location' => 'sometimes|string',
            ]);

            $store->update($validated);
            return $this->success($store, 'Store updated successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function destroy(Store $store)
    {
        try {
            $store->delete();
            return $this->success(null, 'Store deleted successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}