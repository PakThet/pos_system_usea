<?php

namespace Database\Seeders;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Database\Seeder;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        $sales = [
            [
                'transaction_id' => 'TXN' . time() . '001',
                'store_id' => 1,
                'customer_id' => 1,
                'cashier_id' => 1,
                'subtotal_amount' => 189998.00,
                'tax_amount' => 30399.68,
                'discount_amount' => 0.00,
                'total_amount' => 220397.68,
                'payment_method' => 'card',
                'status' => 'completed',
                'notes' => 'Customer purchased iPhone and AirPods',
            ],
        ];

        foreach ($sales as $saleData) {
            $sale = Sale::create($saleData);

            // Create sale items
            $saleItems = [
                [
                    'sale_id' => $sale->id,
                    'product_id' => 1,
                    'product_name' => 'iPhone 15 Pro Max',
                    'sku' => 'IP15PM-256GB',
                    'category_name' => 'Smartphones',
                    'quantity' => 1,
                    'unit_price' => 159999.00,
                    'tax_rate' => 16.0,
                    'discount_amount' => 0.00,
                    'total_price' => 159999.00,
                ],
                [
                    'sale_id' => $sale->id,
                    'product_id' => 9,
                    'product_name' => 'Apple AirPods Pro (2nd Gen)',
                    'sku' => 'APP2-WHITE',
                    'category_name' => 'Audio Devices',
                    'quantity' => 1,
                    'unit_price' => 29999.00,
                    'tax_rate' => 16.0,
                    'discount_amount' => 0.00,
                    'total_price' => 29999.00,
                ],
            ];

            foreach ($saleItems as $item) {
                SaleItem::create($item);
            }
        }
    }
}