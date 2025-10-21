<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run()
    {
        $stores = [
            [
                'name' => 'Main Store',
                'location' => '123 Main Street, City Center',
            ],
            [
                'name' => 'Mall Branch',
                'location' => '456 Mall Road, Shopping District',
            ],
            [
                'name' => 'Downtown Store',
                'location' => '789 Downtown Avenue, Business Area',
            ],
            [
                'name' => 'Northside Branch',
                'location' => '321 North Street, Residential Area',
            ],
            [
                'name' => 'Westend Store',
                'location' => '654 Westend Boulevard, Commercial Zone',
            ],
        ];

        foreach ($stores as $store) {
            Store::create($store);
        }

        $this->command->info('Stores seeded successfully!');
    }
}