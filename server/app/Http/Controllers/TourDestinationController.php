<?php

namespace App\Http\Controllers;

use App\Models\TourDestination;
use Illuminate\Http\JsonResponse;

class TourDestinationController extends Controller
{
    /**
     * Get all tour destinations.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $destinations = TourDestination::query()
            ->withCount('guides')
            ->orderByDesc('rating')
            ->orderBy('title')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $destinations,
        ]);
    }

    /**
     * Get a single destination by slug with its guides.
     *
     * @param string $slug
     * @return JsonResponse
     */
    public function show(string $slug): JsonResponse
    {
        $destination = TourDestination::query()
            ->withCount('guides')
            ->with([
                'guides' => function ($query) {
                    $query
                        ->orderByDesc('rating')
                        ->orderByDesc('experience_years')
                        ->orderBy('name');
                },
            ])
            ->where('slug', $slug)
            ->first();

        if (!$destination) {
            return response()->json([
                'status' => 'error',
                'message' => 'Destination not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $destination,
        ]);
    }
}
