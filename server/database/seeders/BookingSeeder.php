<?php

namespace Database\Seeders;

use App\Models\Booking;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Pending bookings
        Booking::create([
            'user_id' => 2, // John Doe
            'tour_package_id' => 1, // European Adventure
            'booking_date' => Carbon::now()->addDays(30),
            'participants' => 2,
            'total_price' => 5000.00, // 2500 * 2
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);

        Booking::create([
            'user_id' => 3, // Jane Smith
            'tour_package_id' => 2, // Asian Culinary Journey
            'booking_date' => Carbon::now()->addDays(45),
            'participants' => 1,
            'total_price' => 1800.00,
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);

        // Approved bookings
        Booking::create([
            'user_id' => 4, // Bob Johnson
            'tour_package_id' => 3, // African Safari
            'booking_date' => Carbon::now()->addDays(20),
            'participants' => 2,
            'total_price' => 6400.00, // 3200 * 2
            'status' => 'approved',
            'payment_status' => 'paid',
        ]);

        Booking::create([
            'user_id' => 5, // Alice Brown
            'tour_package_id' => 4, // Mediterranean Cruise
            'booking_date' => Carbon::now()->addDays(15),
            'participants' => 3,
            'total_price' => 8400.00, // 2800 * 3
            'status' => 'approved',
            'payment_status' => 'paid',
        ]);

        Booking::create([
            'user_id' => 2, // John Doe
            'tour_package_id' => 5, // Northern Lights
            'booking_date' => Carbon::now()->addDays(60),
            'participants' => 1,
            'total_price' => 2200.00,
            'status' => 'approved',
            'payment_status' => 'unpaid',
        ]);

        // Rejected booking
        Booking::create([
            'user_id' => 3, // Jane Smith
            'tour_package_id' => 1, // European Adventure
            'booking_date' => Carbon::now()->addDays(10),
            'participants' => 25, // Over max participants
            'total_price' => 62500.00,
            'status' => 'rejected',
            'payment_status' => 'unpaid',
        ]);
    }
}