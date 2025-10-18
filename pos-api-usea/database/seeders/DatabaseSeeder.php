<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            StoreSeeder::class,
            CategorySeeder::class,
            CashierSeeder::class,
            CustomerSeeder::class,
            ProductSeeder::class,
            SaleSeeder::class, // Uncomment if you want sample sales
            OrderSeeder::class, // Uncomment if you want sample orders
        ]);
    }
}