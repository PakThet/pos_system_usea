<?php

namespace Database\Seeders;

use App\Models\Cashier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CashierSeeder extends Seeder
{
    public function run(): void
    {
        $cashiers = [
            [
                'store_id' => 1,
                'employee_id' => 'EMP001',
                'first_name' => 'John',
                'last_name' => 'Mwangi',
                'email' => 'john.mwangi@store.com',
                'phone' => '+254712345678',
                'avatar' => null,
                'status' => 'active',
                'role' => 'head-cashier',
                'shift' => 'morning',
                'hourly_rate' => 450.00,
                'total_hours' => 160,
                'total_sales' => 1250000.00,
                'total_transactions' => 345,
                'last_login_at' => now(),
                'permissions' => json_encode(['all']),
            ],
            [
                'store_id' => 1,
                'employee_id' => 'EMP002',
                'first_name' => 'Mary',
                'last_name' => 'Wanjiku',
                'email' => 'mary.wanjiku@store.com',
                'phone' => '+254723456789',
                'avatar' => null,
                'status' => 'active',
                'role' => 'senior-cashier',
                'shift' => 'afternoon',
                'hourly_rate' => 380.00,
                'total_hours' => 145,
                'total_sales' => 980000.00,
                'total_transactions' => 278,
                'last_login_at' => now()->subHours(2),
                'permissions' => json_encode(['sales', 'returns', 'reports']),
            ],
            [
                'store_id' => 1,
                'employee_id' => 'EMP003',
                'first_name' => 'Peter',
                'last_name' => 'Kamau',
                'email' => 'peter.kamau@store.com',
                'phone' => '+254734567890',
                'avatar' => null,
                'status' => 'on-break',
                'role' => 'cashier',
                'shift' => 'evening',
                'hourly_rate' => 320.00,
                'total_hours' => 120,
                'total_sales' => 650000.00,
                'total_transactions' => 195,
                'last_login_at' => now()->subHours(5),
                'permissions' => json_encode(['sales', 'returns']),
            ],
            [
                'store_id' => 1,
                'employee_id' => 'EMP004',
                'first_name' => 'Sarah',
                'last_name' => 'Achieng',
                'email' => 'sarah.achieng@store.com',
                'phone' => '+254745678901',
                'avatar' => null,
                'status' => 'active',
                'role' => 'cashier',
                'shift' => 'night',
                'hourly_rate' => 350.00,
                'total_hours' => 110,
                'total_sales' => 520000.00,
                'total_transactions' => 167,
                'last_login_at' => now()->subDays(1),
                'permissions' => json_encode(['sales']),
            ],
            [
                'store_id' => 2,
                'employee_id' => 'EMP005',
                'first_name' => 'David',
                'last_name' => 'Omondi',
                'email' => 'david.omondi@store.com',
                'phone' => '+254756789012',
                'avatar' => null,
                'status' => 'inactive',
                'role' => 'cashier',
                'shift' => 'morning',
                'hourly_rate' => 300.00,
                'total_hours' => 85,
                'total_sales' => 320000.00,
                'total_transactions' => 98,
                'last_login_at' => now()->subDays(15),
                'permissions' => json_encode(['sales']),
            ],
        ];

        foreach ($cashiers as $cashier) {
            Cashier::create($cashier);
        }
    }
}