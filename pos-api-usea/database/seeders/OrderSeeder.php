<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $customers = Customer::all();
        $cashiers = User::where('role', 'cashier')->orWhere('role', 'admin')->orWhere('role', 'manager')->get();
        $products = Product::all();

        $statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

        for ($i = 0; $i < 30; $i++) {
            $subtotal = 0;
            $taxAmount = 0;
            $discountAmount = 0;
            $shippingAmount = rand(0, 1) ? 9.99 : 0;
            
            $customer = $customers->random();
            $shippingAddress = $customer->addresses->where('type', 'shipping')->first();
            $billingAddress = $customer->addresses->where('type', 'billing')->first();

            // Create order
            $order = Order::create([
                'store_id' => 1, // Main store
                'customer_id' => $customer->id,
                'cashier_id' => $cashiers->random()->id,
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $billingAddress->id,
                'status' => $statuses[array_rand($statuses)],
                'payment_status' => $paymentStatuses[array_rand($paymentStatuses)],
                'subtotal_amount' => 0,
                'tax_amount' => 0,
                'shipping_amount' => $shippingAmount,
                'discount_amount' => 0,
                'total_amount' => 0,
                'tracking_number' => rand(0, 1) ? 'TRK' . strtoupper(uniqid()) : null,
                'estimated_delivery' => rand(0, 1) ? now()->addDays(rand(3, 14)) : null,
                'created_at' => now()->subDays(rand(1, 60)),
            ]);

            // Create order items (1-4 items per order)
            $itemCount = rand(1, 4);
            $orderItems = [];

            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $quantity = rand(1, 2);
                $price = $product->price;
                $totalPrice = $price * $quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $price,
                    'quantity' => $quantity,
                    'total_price' => $totalPrice,
                    'created_at' => $order->created_at,
                ]);

                $subtotal += $totalPrice;
            }

            // Calculate tax and discount
            $taxRate = 8.5; // Average tax rate
            $taxAmount = $subtotal * ($taxRate / 100);
            $discountAmount = rand(0, 1) ? $subtotal * (rand(5, 15) / 100) : 0;
            $totalAmount = $subtotal + $taxAmount + $shippingAmount - $discountAmount;

            // Update order totals
            $order->update([
                'subtotal_amount' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
            ]);

            // Update product quantities for shipped/delivered orders
            if (in_array($order->status, ['shipped', 'delivered'])) {
                foreach ($order->items as $item) {
                    $product = Product::find($item->product_id);
                    $product->decrement('quantity', $item->quantity);
                }
            }
        }

        $this->command->info('Orders seeded successfully!');
    }
}