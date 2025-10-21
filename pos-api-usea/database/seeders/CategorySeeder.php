<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Smartphones, laptops, tablets and other electronic devices',
                'status' => 'active',
            ],
            [
                'name' => 'Clothing',
                'slug' => 'clothing',
                'description' => 'Men, women and children clothing and accessories',
                'status' => 'active',
            ],
            [
                'name' => 'Home & Kitchen',
                'slug' => 'home-kitchen',
                'description' => 'Home appliances, kitchenware and household items',
                'status' => 'active',
            ],
            [
                'name' => 'Books',
                'slug' => 'books',
                'description' => 'Fiction, non-fiction, educational books and magazines',
                'status' => 'active',
            ],
            [
                'name' => 'Sports',
                'slug' => 'sports',
                'description' => 'Sports equipment, fitness gear and outdoor activities',
                'status' => 'active',
            ],
            [
                'name' => 'Beauty',
                'slug' => 'beauty',
                'description' => 'Cosmetics, skincare and beauty products',
                'status' => 'active',
            ],
            [
                'name' => 'Toys',
                'slug' => 'toys',
                'description' => 'Children toys, games and educational play items',
                'status' => 'active',
            ],
            [
                'name' => 'Food & Beverages',
                'slug' => 'food-beverages',
                'description' => 'Groceries, snacks, drinks and food items',
                'status' => 'active',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('Categories seeded successfully!');
    }
}