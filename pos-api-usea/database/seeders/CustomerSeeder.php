<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerAddress;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run()
    {
        $customers = [
            [
                'first_name' => 'Alice',
                'last_name' => 'Johnson',
                'email' => 'alice.johnson@email.com',
                'phone' => '+1987654321',
                'status' => 'active',
                'tier' => 'premium',
                'total_orders' => 12,
                'total_spent' => 2450.75,
                'last_order_at' => now()->subDays(5),
                'notes' => 'Loyal customer, prefers email communication',
            ],
            [
                'first_name' => 'Bob',
                'last_name' => 'Williams',
                'email' => 'bob.williams@email.com',
                'phone' => '+1987654322',
                'status' => 'active',
                'tier' => 'vip',
                'total_orders' => 25,
                'total_spent' => 5890.50,
                'last_order_at' => now()->subDays(2),
                'notes' => 'VIP customer, high value purchases',
            ],
            [
                'first_name' => 'Carol',
                'last_name' => 'Miller',
                'email' => 'carol.miller@email.com',
                'phone' => '+1987654323',
                'status' => 'active',
                'tier' => 'standard',
                'total_orders' => 5,
                'total_spent' => 450.25,
                'last_order_at' => now()->subDays(15),
                'notes' => 'New customer, potential for growth',
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Garcia',
                'email' => 'david.garcia@email.com',
                'phone' => '+1987654324',
                'status' => 'inactive',
                'tier' => 'standard',
                'total_orders' => 3,
                'total_spent' => 280.00,
                'last_order_at' => now()->subMonths(3),
                'notes' => 'Inactive for 3 months',
            ],
            [
                'first_name' => 'Emma',
                'last_name' => 'Martinez',
                'email' => 'emma.martinez@email.com',
                'phone' => '+1987654325',
                'status' => 'active',
                'tier' => 'premium',
                'total_orders' => 18,
                'total_spent' => 3200.00,
                'last_order_at' => now()->subDays(7),
                'notes' => 'Frequent buyer, likes discounts',
            ],
            [
                'first_name' => 'Frank',
                'last_name' => 'Anderson',
                'email' => 'frank.anderson@email.com',
                'phone' => '+1987654326',
                'status' => 'active',
                'tier' => 'standard',
                'total_orders' => 8,
                'total_spent' => 890.75,
                'last_order_at' => now()->subDays(10),
                'notes' => 'Prefers online shopping',
            ],
            [
                'first_name' => 'Grace',
                'last_name' => 'Thomas',
                'email' => 'grace.thomas@email.com',
                'phone' => '+1987654327',
                'status' => 'active',
                'tier' => 'vip',
                'total_orders' => 30,
                'total_spent' => 7500.00,
                'last_order_at' => now()->subDays(1),
                'notes' => 'Top customer, very satisfied',
            ],
            [
                'first_name' => 'Henry',
                'last_name' => 'Jackson',
                'email' => 'henry.jackson@email.com',
                'phone' => '+1987654328',
                'status' => 'active',
                'tier' => 'premium',
                'total_orders' => 15,
                'total_spent' => 2100.50,
                'last_order_at' => now()->subDays(3),
                'notes' => 'Business customer',
            ],
        ];

        foreach ($customers as $customerData) {
            $customer = Customer::create($customerData);

            // Create addresses for each customer
            CustomerAddress::create([
                'customer_id' => $customer->id,
                'street' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'zip_code' => fake()->postcode(),
                'country' => 'United States',
                'type' => 'shipping',
                'is_default' => true,
            ]);

            CustomerAddress::create([
                'customer_id' => $customer->id,
                'street' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'zip_code' => fake()->postcode(),
                'country' => 'United States',
                'type' => 'billing',
                'is_default' => true,
            ]);
        }

        $this->command->info('Customers seeded successfully!');
    }
}