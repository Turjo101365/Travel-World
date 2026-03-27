<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TourPackage;
use App\Models\Booking;

class DashboardController extends Controller
{
    public function getStats()
    {
        $totalUsers = User::count();
        $totalPackages = TourPackage::count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        $totalRevenue = Booking::where('payment_status', 'paid')->sum('total_price');

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalPackages' => $totalPackages,
            'pendingBookings' => $pendingBookings,
            'totalRevenue' => $totalRevenue,
        ]);
    }
}
