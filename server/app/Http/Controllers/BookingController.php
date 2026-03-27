<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\TourPackage;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    // Admin: see all
    public function index()
    {
        $bookings = Booking::with(['user', 'tourPackage'])->orderBy('created_at', 'desc')->get();
        return response()->json($bookings);
    }

    // Customer: see their own
    public function userBookings()
    {
        $user = Auth::guard('api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $bookings = Booking::with('tourPackage')->where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        return response()->json($bookings);
    }

    // Customer: create
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tour_package_id' => 'required|exists:tour_packages,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'participants' => 'required|integer|min:1',
        ]);

        $user = Auth::guard('api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $package = TourPackage::findOrFail($validated['tour_package_id']);
        
        $validated['user_id'] = $user->id;
        $validated['total_price'] = $package->price * $validated['participants'];
        $validated['status'] = 'pending';
        // Simulating immediate payment for now, or could link to PaymentIntegration
        $validated['payment_status'] = 'unpaid';

        $booking = Booking::create($validated);
        return response()->json($booking, 201);
    }

    // Admin: update status (approve/reject)
    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $booking->update($validated);
        return response()->json($booking);
    }
}
