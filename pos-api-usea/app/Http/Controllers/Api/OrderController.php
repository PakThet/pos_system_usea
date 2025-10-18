<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\OrderItem;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends ApiController
{
    public function index()
    {
        try {
            $orders = Order::with([
                'store', 
                'customer', 
                'cashier', 
                'items.product',
                'shippingAddress',
                'billingAddress'
            ])->latest()->get();
            
            return $this->success($orders, 'Orders fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'store_id' => 'required|exists:stores,id',
                'customer_id' => 'required|exists:customers,id',
                'cashier_id' => 'nullable|exists:cashiers,id',
                'status' => 'sometimes|in:pending,confirmed,processing,shipped,delivered,cancelled',
                'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
                'subtotal_amount' => 'required|numeric|min:0',
                'tax_amount' => 'sometimes|numeric|min:0',
                'shipping_amount' => 'sometimes|numeric|min:0',
                'discount_amount' => 'sometimes|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'tracking_number' => 'nullable|string',
                'estimated_delivery' => 'nullable|date',
                'shipping_address_id' => 'required|exists:customer_addresses,id',
                'billing_address_id' => 'required|exists:customer_addresses,id',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
            ]);

            // Generate order number
            $validated['order_number'] = 'ORD' . Str::upper(Str::random(8)) . time();

            // Create order
            $order = Order::create($validated);

            // Create order items
            foreach ($validated['items'] as $itemData) {
                $product = \App\Models\Product::find($itemData['product_id']);
                
                $orderItem = new OrderItem([
                    'product_id' => $itemData['product_id'],
                    'product_name' => $product->name,
                    'price' => $itemData['price'],
                    'quantity' => $itemData['quantity'],
                    'total_price' => $itemData['price'] * $itemData['quantity'],
                ]);

                $order->items()->save($orderItem);

                // Update product quantity
                $product->decrement('quantity', $itemData['quantity']);
            }

            // Update customer stats
            $customer = $order->customer;
            $customer->increment('total_orders');
            $customer->increment('total_spent', $order->total_amount);
            $customer->update(['last_order_at' => now()]);

            return $this->success($order->load([
                'store', 
                'customer', 
                'cashier', 
                'items.product',
                'shippingAddress',
                'billingAddress'
            ]), 'Order created successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function show(Order $order)
    {
        try {
            $order->load([
                'store', 
                'customer', 
                'cashier', 
                'items.product',
                'shippingAddress',
                'billingAddress'
            ]);
            return $this->success($order, 'Order fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function update(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'status' => 'sometimes|in:pending,confirmed,processing,shipped,delivered,cancelled',
                'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
                'tracking_number' => 'nullable|string',
                'estimated_delivery' => 'nullable|date',
            ]);

            $order->update($validated);
            return $this->success($order->load([
                'store', 
                'customer', 
                'cashier', 
                'items.product',
                'shippingAddress',
                'billingAddress'
            ]), 'Order updated successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function destroy(Order $order)
    {
        try {
            // Restore product quantities
            foreach ($order->items as $item) {
                $product = \App\Models\Product::find($item->product_id);
                if ($product) {
                    $product->increment('quantity', $item->quantity);
                }
            }

            $order->delete();
            return $this->success(null, 'Order deleted successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}