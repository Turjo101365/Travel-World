<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\TourGuide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * List payment history for currently authenticated user.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $payments = Payment::with(['guide:id,name,location,hire_cost,phone,email,photo'])
            ->where('user_id', Auth::id())
            ->latest('id')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $payments,
        ]);
    }

    /**
     * Store a new payment for hiring a tour guide.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->merge([
            'card_number' => preg_replace('/\D+/', '', (string) $request->input('card_number')),
            'cvv' => preg_replace('/\D+/', '', (string) $request->input('cvv')),
            'expiry' => trim((string) $request->input('expiry')),
            'name_on_card' => trim((string) $request->input('name_on_card')),
        ]);

        $validated = $request->validate([
            'guide_id' => ['required', 'integer', 'exists:tour_guides,id'],
            'days' => ['required', 'integer', 'min:1', 'max:30'],
            'name_on_card' => ['required', 'string', 'max:255'],
            'card_number' => ['required', 'digits_between:13,19'],
            'expiry' => ['required', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
            'cvv' => ['required', 'digits_between:3,4'],
        ]);

        if (!$this->isExpiryValid($validated['expiry'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Card expiry date is invalid or already expired.',
                'errors' => [
                    'expiry' => ['Card expiry date is invalid or already expired.'],
                ],
            ], 422);
        }

        $guide = TourGuide::findOrFail((int) $validated['guide_id']);
        $days = (int) $validated['days'];
        $hireCostPerDay = (float) $guide->hire_cost;
        $amount = round($hireCostPerDay * $days, 2);
        $cardNumber = (string) $validated['card_number'];

        $payment = Payment::create([
            'user_id' => (int) Auth::id(),
            'tour_guide_id' => $guide->id,
            'transaction_id' => $this->generateTransactionId(),
            'amount' => $amount,
            'currency' => 'USD',
            'days' => $days,
            'card_holder_name' => $validated['name_on_card'],
            'card_brand' => $this->detectCardBrand($cardNumber),
            'card_last_four' => substr($cardNumber, -4),
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Payment completed successfully.',
            'data' => $payment->load(['guide:id,name,location,hire_cost,phone,email,photo']),
        ], 201);
    }

    /**
     * Generate a unique transaction id.
     *
     * @return string
     */
    private function generateTransactionId(): string
    {
        do {
            $transactionId = 'TW-' . strtoupper(Str::random(12));
        } while (Payment::where('transaction_id', $transactionId)->exists());

        return $transactionId;
    }

    /**
     * Basic card brand detection from card number.
     *
     * @param string $cardNumber
     * @return string
     */
    private function detectCardBrand(string $cardNumber): string
    {
        if (preg_match('/^4/', $cardNumber)) {
            return 'Visa';
        }

        if (preg_match('/^(5[1-5]|2[2-7])/', $cardNumber)) {
            return 'Mastercard';
        }

        if (preg_match('/^3[47]/', $cardNumber)) {
            return 'Amex';
        }

        if (preg_match('/^6(?:011|5)/', $cardNumber)) {
            return 'Discover';
        }

        return 'Unknown';
    }

    /**
     * Validate card expiry in MM/YY format and ensure it has not expired.
     *
     * @param string $expiry
     * @return bool
     */
    private function isExpiryValid(string $expiry): bool
    {
        if (!preg_match('/^(0[1-9]|1[0-2])\/(\d{2})$/', $expiry, $matches)) {
            return false;
        }

        $month = (int) $matches[1];
        $year = 2000 + (int) $matches[2];
        $currentYear = (int) now()->format('Y');
        $currentMonth = (int) now()->format('n');

        if ($year < $currentYear) {
            return false;
        }

        if ($year === $currentYear && $month < $currentMonth) {
            return false;
        }

        return true;
    }
}
