<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Path to your local images folder (put your images here)
        $sourcePath = public_path('images/products');
        $destinationPath = storage_path('app/public/products');

        // Ensure the destination directory exists
        if (!File::exists($destinationPath)) {
            File::makeDirectory($destinationPath, 0755, true);
        }

        $products = [
            // Smartphones
            [
                'store_id' => 1,
                'category_id' => 1,
                'name' => 'iPhone 15 Pro Max',
                'description' => 'Latest iPhone with A17 Pro chip and titanium design',
                'sku' => 'IP15PM-256GB',
                'slug' => 'iphone-15-pro-max',
                'barcode' => '194253775300',
                'price' => 159999.00,
                'cost_price' => 135000.00,
                'tax_rate' => 16.0,
                'quantity' => 25,
                'quantity_alert' => 5,
                'image' => '11.jpg',
                'status' => 'active',
            ],
            [
                'store_id' => 1,
                'category_id' => 1,
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Premium Android phone with S Pen and advanced AI features',
                'sku' => 'SGS24U-512GB',
                'slug' => 'samsung-galaxy-s24-ultra',
                'barcode' => '887276257123',
                'price' => 139999.00,
                'cost_price' => 118000.00,
                'tax_rate' => 16.0,
                'quantity' => 18,
                'quantity_alert' => 5,
                'image' => '22.jpg',
                'status' => 'active',
            ],
            [
                'store_id' => 1,
                'category_id' => 1,
                'name' => 'Google Pixel 8 Pro',
                'description' => 'Google flagship with advanced camera and AI capabilities',
                'sku' => 'GP8P-256GB',
                'slug' => 'google-pixel-8-pro',
                'barcode' => '817240021234',
                'price' => 119999.00,
                'cost_price' => 98000.00,
                'tax_rate' => 16.0,
                'quantity' => 12,
                'quantity_alert' => 3,
                'image' => '33.jpg',
                'status' => 'active',
            ],
        ];

        foreach ($products as $product) {
            $imageName = $product['image'];

            // ✅ Copy image to storage/app/public/products if it exists
            $sourceImage = $sourcePath . '/' . $imageName;
            $destinationImage = $destinationPath . '/' . $imageName;

            if (File::exists($sourceImage)) {
                File::copy($sourceImage, $destinationImage);
            } else {
                $this->command->warn("⚠️ Image not found: {$sourceImage}");
            }

            // ✅ Save product to database with correct path
            Product::create([
                'store_id' => $product['store_id'],
                'category_id' => $product['category_id'],
                'name' => $product['name'],
                'description' => $product['description'],
                'sku' => $product['sku'],
                'slug' => $product['slug'] ?? Str::slug($product['name']),
                'barcode' => $product['barcode'],
                'price' => $product['price'],
                'cost_price' => $product['cost_price'],
                'tax_rate' => $product['tax_rate'],
                'quantity' => $product['quantity'],
                'quantity_alert' => $product['quantity_alert'],
                'image' => 'products/' . $imageName,
                'status' => $product['status'],
            ]);
        }

        $this->command->info('✅ Product seeding completed successfully with images.');
    }
}
