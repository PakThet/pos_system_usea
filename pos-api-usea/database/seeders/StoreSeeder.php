<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $stores = [
            [
                'name' => 'Main Store',
                'location' => '123 Main Street, City Center, Nairobi',
            ],
            [
                'name' => 'Westgate Branch',
                'location' => 'Westgate Mall, Mwanzi Road, Nairobi',
            ],
            [
                'name' => 'Garden City Branch',
                'location' => 'Garden City Mall, Thika Road, Nairobi',
            ],
            [
                'name' => 'Two Rivers Branch',
                'location' => 'Two Rivers Mall, Limuru Road, Nairobi',
            ],
        ];

        foreach ($stores as $store) {
            Store::create($store);
        }
    }
}