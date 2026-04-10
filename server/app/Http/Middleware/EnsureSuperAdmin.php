<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureSuperAdmin
{
    /**
     * Allow access only to the fixed super admin account.
     *
     * @param Request $request
     * @param Closure $next
     * @return JsonResponse|mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if (!method_exists($user, 'isSuperAdmin') || !$user->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Super admin access required.',
            ], 403);
        }

        return $next($request);
    }
}
