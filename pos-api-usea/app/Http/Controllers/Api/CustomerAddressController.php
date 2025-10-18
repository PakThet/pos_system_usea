<?php

namespace App\Http\Controllers\Api;

use App\Models\CustomerAddress;
use Exception;
use Illuminate\Http\Request;

class CustomerAddressController extends ApiController
{
    public function index($customerId)
    {
        try {
            $addresses = CustomerAddress::where('customer_id', $customerId)->get();
            return $this->success($addresses, 'Addresses fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'street' => 'required|string',
                'city' => 'required|string',
                'state' => 'required|string',
                'zip_code' => 'required|string',
                'country' => 'required|string',
                'type' => 'required|in:billing,shipping,both',
                'is_default' => 'sometimes|boolean',
            ]);

            $address = CustomerAddress::create($validated);
            return $this->success($address, 'Address created successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function show(CustomerAddress $address)
    {
        try {
            $address->load('customer');
            return $this->success($address, 'Address fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function update(Request $request, CustomerAddress $address)
    {
        try {
            $validated = $request->validate([
                'street' => 'sometimes|string',
                'city' => 'sometimes|string',
                'state' => 'sometimes|string',
                'zip_code' => 'sometimes|string',
                'country' => 'sometimes|string',
                'type' => 'sometimes|in:billing,shipping,both',
                'is_default' => 'sometimes|boolean',
            ]);

            $address->update($validated);
            return $this->success($address, 'Address updated successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function destroy(CustomerAddress $address)
    {
        try {
            $address->delete();
            return $this->success(null, 'Address deleted successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}