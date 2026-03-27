<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@travelworld.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1 234 567 8900',
            'address' => '123 Admin Street, Admin City, AC 12345',
        ]);

        // Create sample customers
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1 234 567 8901',
            'address' => '456 Customer Ave, Customer City, CC 67890',
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1 234 567 8902',
            'address' => '789 Tourist Blvd, Tourist Town, TT 11223',
        ]);

        User::create([
            'name' => 'Bob Johnson',
            'email' => 'bob@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1 234 567 8903',
            'address' => '321 Explorer Rd, Explorer City, EC 44556',
        ]);

        User::create([
            'name' => 'Alice Brown',
            'email' => 'alice@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1 234 567 8904',
            'address' => '654 Wanderer Ln, Wanderer Village, WV 77889',
        ]);
    }
}