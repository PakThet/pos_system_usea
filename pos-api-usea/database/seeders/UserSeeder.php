<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [
            [
                'employee_id' => 'EMP001',
                'first_name' => 'Pak',
                'last_name' => 'Thet',
                'email' => 'admin@gmail.com',
                'phone' => '+1234567890',
                'status' => 'active',
                'role' => 'admin',
                'shift' => 'morning',
                'hourly_rate' => 25.00,
                'total_hours' => 160,
                'total_sales' => 15000.00,
                'total_transactions' => 120,
                'permissions' => ['all'],
                'password' => Hash::make('123'),
            ],
            [
                'employee_id' => 'EMP002',
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane.smith@store.com',
                'phone' => '+1234567891',
                'status' => 'active',
                'role' => 'manager',
                'shift' => 'evening',
                'hourly_rate' => 20.00,
                'total_hours' => 140,
                'total_sales' => 12000.00,
                'total_transactions' => 95,
                'permissions' => ['manage_products', 'manage_sales', 'view_reports'],
                'password' => Hash::make('password123'),
            ],
            [
                'employee_id' => 'EMP003',
                'first_name' => 'Mike',
                'last_name' => 'Johnson',
                'email' => 'mike.johnson@store.com',
                'phone' => '+1234567892',
                'status' => 'active',
                'role' => 'cashier',
                'shift' => 'morning',
                'hourly_rate' => 15.00,
                'total_hours' => 120,
                'total_sales' => 8000.00,
                'total_transactions' => 75,
                'permissions' => ['process_sales', 'view_products'],
                'password' => Hash::make('password123'),
            ],
            [
                'employee_id' => 'EMP004',
                'first_name' => 'Sarah',
                'last_name' => 'Wilson',
                'email' => 'sarah.wilson@store.com',
                'phone' => '+1234567893',
                'status' => 'active',
                'role' => 'cashier',
                'shift' => 'evening',
                'hourly_rate' => 15.00,
                'total_hours' => 110,
                'total_sales' => 7500.00,
                'total_transactions' => 68,
                'permissions' => ['process_sales', 'view_products'],
                'password' => Hash::make('password123'),
            ],
            [
                'employee_id' => 'EMP005',
                'first_name' => 'David',
                'last_name' => 'Brown',
                'email' => 'david.brown@store.com',
                'phone' => '+1234567894',
                'status' => 'inactive',
                'role' => 'cashier',
                'shift' => 'night',
                'hourly_rate' => 16.00,
                'total_hours' => 80,
                'total_sales' => 5000.00,
                'total_transactions' => 45,
                'permissions' => ['process_sales', 'view_products'],
                'password' => Hash::make('password123'),
            ],
            [
                'employee_id' => 'EMP006',
                'first_name' => 'Lisa',
                'last_name' => 'Davis',
                'email' => 'lisa.davis@store.com',
                'phone' => '+1234567895',
                'status' => 'active',
                'role' => 'manager',
                'shift' => 'morning',
                'hourly_rate' => 22.00,
                'total_hours' => 130,
                'total_sales' => 11000.00,
                'total_transactions' => 88,
                'permissions' => ['manage_products', 'manage_sales', 'view_reports'],
                'password' => Hash::make('password123'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        $this->command->info('Users seeded successfully!');
    }
}