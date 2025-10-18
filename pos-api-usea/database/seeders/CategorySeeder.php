<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Electronics
            [
                'name' => 'Smartphones',
                'slug' => 'smartphones',
                'description' => 'Latest smartphones and mobile devices',
                'status' => 'active',
            ],
            [
                'name' => 'Laptops',
                'slug' => 'laptops',
                'description' => 'Laptops and computing devices',
                'status' => 'active',
            ],
            [
                'name' => 'Audio Devices',
                'slug' => 'audio-devices',
                'description' => 'Headphones, speakers, and audio equipment',
                'status' => 'active',
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Phone cases, chargers, and other accessories',
                'status' => 'active',
            ],
            [
                'name' => 'Tablets',
                'slug' => 'tablets',
                'description' => 'Tablets and portable devices',
                'status' => 'active',
            ],
            [
                'name' => 'Wearables',
                'slug' => 'wearables',
                'description' => 'Smart watches and fitness trackers',
                'status' => 'active',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}