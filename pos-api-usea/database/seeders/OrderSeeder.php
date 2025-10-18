<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            [
                'order_number' => 'ORD' . time() . '001',
                'store_id' => 1,
                'customer_id' => 2,
                'cashier_id' => 2,
                'status' => 'processing',
                'payment_status' => 'paid',
                'subtotal_amount' => 139999.00,
                'tax_amount' => 22399.84,
                'shipping_amount' => 500.00,
                'discount_amount' => 0.00,
                'total_amount' => 162898.84,
                'tracking_number' => 'TRK' . time(),
                'estimated_delivery' => now()->addDays(3),
                'shipping_address_id' => 2,
                'billing_address_id' => 2,
            ],
        ];

        foreach ($orders as $orderData) {
            $order = Order::create($orderData);

            // Create order items
            $orderItems = [
                [
                    'order_id' => $order->id,
                    'product_id' => 2,
                    'product_name' => 'Samsung Galaxy S24 Ultra',
                    'price' => 139999.00,
                    'quantity' => 1,
                    'total_price' => 139999.00,
                ],
            ];

            foreach ($orderItems as $item) {
                OrderItem::create($item);
            }
        }
    }
}