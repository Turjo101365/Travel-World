<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetCodeMail;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetCodeController extends Controller
{
    /**
     * Generate a password reset code for a user email.
     */
    public function sendCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        $response = [
            'status' => 'success',
            'message' => 'If an account exists for this email, a reset code has been sent.',
        ];

        // Keep response generic to avoid leaking whether an email exists.
        if (!$user) {
            return response()->json($response);
        }

        try {
            $token = Password::broker()->createToken($user);
            $expireMinutes = (int) config('auth.passwords.users.expire', 60);

            Mail::to($user->email)->send(
                new PasswordResetCodeMail($user->name ?? 'Traveler', $token, $expireMinutes)
            );
        } catch (\Throwable $exception) {
            Log::error('Failed to send password reset code email.', [
                'email' => $request->email,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Unable to send reset code email. Please check mail configuration and try again.',
            ], 500);
        }

        return response()->json($response);
    }

    /**
     * Reset a user's password using email + reset code.
     */
    public function reset(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        // Normalize pasted codes copied from email clients (they may include spaces/newlines).
        $normalizedCode = strtolower((string) preg_replace('/\s+/u', '', (string) $request->input('code', '')));

        if ($normalizedCode === '') {
            throw ValidationException::withMessages([
                'code' => ['Reset code is required.'],
            ]);
        }

        $status = Password::broker()->reset(
            [
                'email' => $request->input('email'),
                'token' => $normalizedCode,
                'password' => $request->input('password'),
                'password_confirmation' => $request->input('password_confirmation'),
            ],
            function ($user, $password) {
                $user->forceFill([
                    // User model mutator hashes the value.
                    'password' => $password,
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            $message = $status === Password::INVALID_TOKEN
                ? 'Invalid or expired reset code. Use the latest code from your newest email.'
                : __($status);

            throw ValidationException::withMessages([
                'code' => [$message],
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset successful. You can now log in.',
        ]);
    }
}
