<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * List all registered users for the dashboard.
     *
     * @return JsonResponse
     */
    public function users(): JsonResponse
    {
        $users = User::query()
            ->latest('id')
            ->get([
                'id',
                'name',
                'email',
                'phone',
                'address',
                'profile_photo_path',
                'created_at',
            ]);

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    }

    /**
     * Return all guide hire requests using payment records as confirmed bookings.
     *
     * @return JsonResponse
     */
    public function bookings(): JsonResponse
    {
        $bookings = Payment::query()
            ->with([
                'user:id,name,email,phone',
                'guide:id,destination_id,name,location,hire_cost',
                'guide.destination:id,title,location_label,country,city',
            ])
            ->latest('paid_at')
            ->get()
            ->map(function (Payment $payment) {
                $paidAt = $payment->paid_at;
                $endDate = $paidAt ? $paidAt->copy()->addDays((int) $payment->days) : null;

                return [
                    'id' => $payment->id,
                    'transaction_id' => $payment->transaction_id,
                    'status' => $payment->status,
                    'days' => $payment->days,
                    'start_date' => optional($paidAt)->toIso8601String(),
                    'end_date' => optional($endDate)->toIso8601String(),
                    'amount' => $payment->amount,
                    'currency' => $payment->currency,
                    'user' => $payment->user,
                    'guide' => $payment->guide,
                    'destination' => $payment->guide?->destination,
                ];
            })
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
        ]);
    }

    /**
     * Return all payment transactions with user and guide details.
     *
     * @return JsonResponse
     */
    public function payments(): JsonResponse
    {
        $payments = Payment::query()
            ->with([
                'user:id,name,email,phone',
                'guide:id,name,location,hire_cost',
            ])
            ->latest('paid_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $payments,
        ]);
    }
}
