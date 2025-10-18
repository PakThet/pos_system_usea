<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerAddress;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'first_name' => 'James',
                'last_name' => 'Kariuki',
                'email' => 'james.kariuki@email.com',
                'phone' => '+254711223344',
                'avatar' => null,
                'status' => 'active',
                'tier' => 'vip',
                'total_orders' => 15,
                'total_spent' => 125000.00,
                'last_order_at' => now()->subDays(2),
                'notes' => 'Premium customer, prefers email communication',
            ],
            [
                'first_name' => 'Grace',
                'last_name' => 'Nyambura',
                'email' => 'grace.nyambura@email.com',
                'phone' => '+254722334455',
                'avatar' => null,
                'status' => 'active',
                'tier' => 'premium',
                'total_orders' => 8,
                'total_spent' => 68000.00,
                'last_order_at' => now()->subDays(5),
                'notes' => 'Interested in latest smartphones',
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Odhiambo',
                'email' => 'michael.odhiambo@email.com',
                'phone' => '+254733445566',
                'avatar' => null,
                'status' => 'active',
                'tier' => 'standard',
                'total_orders' => 3,
                'total_spent' => 24500.00,
                'last_order_at' => now()->subWeeks(2),
                'notes' => 'New customer, bought laptop accessories',
            ],
            [
                'first_name' => 'Alice',
                'last_name' => 'Wambui',
                'email' => 'alice.wambui@email.com',
                'phone' => '+254744556677',
                'avatar' => null,
                'status' => 'active',
                'tier' => 'premium',
                'total_orders' => 12,
                'total_spent' => 89000.00,
                'last_order_at' => now()->subDays(1),
                'notes' => 'Frequent buyer of audio equipment',
            ],
            [
                'first_name' => 'Robert',
                'last_name' => 'Mutiso',
                'email' => 'robert.mutiso@email.com',
                'phone' => '+254755667788',
                'avatar' => null,
                'status' => 'inactive',
                'tier' => 'standard',
                'total_orders' => 1,
                'total_spent' => 15000.00,
                'last_order_at' => now()->subMonths(3),
                'notes' => 'One-time purchase, follow up required',
            ],
            [
                'first_name' => 'Susan',
                'last_name' => 'Akinyi',
                'email' => 'susan.akinyi@email.com',
                'phone' => '+254766778899',
                'avatar' => null,
                'status' => 'active',
                'tier' => 'vip',
                'total_orders' => 22,
                'total_spent' => 210000.00,
                'last_order_at' => now()->subHours(12),
                'notes' => 'VIP customer, prefers phone calls',
            ],
            [
                'first_name' => 'Daniel',
                'last_name' => 'Kiplagat',
                'email' => 'daniel.kiplagat@email.com',
                'phone' => '+254777889900',
                'avatar' => null,
                'status' => 'active',
                'tier' => 'standard',
                'total_orders' => 5,
                'total_spent' => 42000.00,
                'last_order_at' => now()->subDays(7),
                'notes' => 'Interested in gaming laptops',
            ],
            [
                'first_name' => 'Nancy',
                'last_name' => 'Chebet',
                'email' => 'nancy.chebet@email.com',
                'phone' => '+254788990011',
                'avatar' => null,
                'status' => 'active',
                'tier' => 'premium',
                'total_orders' => 9,
                'total_spent' => 76000.00,
                'last_order_at' => now()->subDays(3),
                'notes' => 'Loyal customer, always buys latest gadgets',
            ],
        ];

        foreach ($customers as $customerData) {
            $customer = Customer::create($customerData);

            // Create default address for each customer
            CustomerAddress::create([
                'customer_id' => $customer->id,
                'street' => '123 Customer Street',
                'city' => 'Nairobi',
                'state' => 'Nairobi County',
                'zip_code' => '00100',
                'country' => 'Kenya',
                'type' => 'both',
                'is_default' => true,
            ]);
        }
    }
}