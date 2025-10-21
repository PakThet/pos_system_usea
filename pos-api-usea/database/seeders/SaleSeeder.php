<?php

namespace Database\Seeders;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;

class SaleSeeder extends Seeder
{
    public function run()
    {
        $customers = Customer::all();
        $cashiers = User::where('role', 'cashier')->orWhere('role', 'admin')->orWhere('role', 'manager')->get();
        $products = Product::all();

        $paymentMethods = ['card', 'cash', 'mobile', 'credit'];
        $statuses = ['completed', 'pending', 'cancelled', 'refunded'];

        for ($i = 0; $i < 50; $i++) {
            $subtotal = 0;
            $taxAmount = 0;
            $discountAmount = 0;
            
            // Create sale
            $sale = Sale::create([
                'store_id' => 1, // Main store
                'customer_id' => $customers->random()->id,
                'cashier_id' => $cashiers->random()->id,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'status' => $statuses[array_rand($statuses)],
                'subtotal_amount' => 0,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total_amount' => 0,
                'notes' => rand(0, 1) ? 'Customer was in a hurry' : null,
                'created_at' => now()->subDays(rand(1, 90)),
            ]);

            // Create sale items (1-5 items per sale)
            $itemCount = rand(1, 5);
            $saleItems = [];

            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $quantity = rand(1, 3);
                $unitPrice = $product->price;
                $discount = rand(0, 1) ? rand(5, 20) : 0;
                $discountAmountItem = ($unitPrice * $quantity) * ($discount / 100);
                $taxRate = $product->tax_rate;
                $totalBeforeTax = ($unitPrice * $quantity) - $discountAmountItem;
                $taxAmountItem = $totalBeforeTax * ($taxRate / 100);
                $totalPrice = $totalBeforeTax + $taxAmountItem;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'sku' => $product->sku,
                    'category_name' => $product->category->name,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'tax_rate' => $taxRate,
                    'discount_amount' => $discountAmountItem,
                    'total_price' => $totalPrice,
                    'created_at' => $sale->created_at,
                ]);

                $subtotal += $unitPrice * $quantity;
                $taxAmount += $taxAmountItem;
                $discountAmount += $discountAmountItem;
            }

            // Update sale totals
            $totalAmount = $subtotal + $taxAmount - $discountAmount;

            $sale->update([
                'subtotal_amount' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
            ]);

            // Update product quantities for completed sales
            if ($sale->status === 'completed') {
                foreach ($sale->items as $item) {
                    $product = Product::find($item->product_id);
                    $product->decrement('quantity', $item->quantity);
                }
            }
        }

        $this->command->info('Sales seeded successfully!');
    }
}