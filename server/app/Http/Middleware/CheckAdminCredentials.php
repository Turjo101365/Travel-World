<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Exception;

class CheckAdminCredentials
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->guard('api')->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Forbidden, Admin access required'], 403);
        }

        return $next($request);
    }
}
