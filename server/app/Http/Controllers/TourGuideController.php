<?php

namespace App\Http\Controllers;

use App\Models\TourGuide;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TourGuideController extends Controller
{
    /**
     * Get all tour guides.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $guides = TourGuide::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $guides
        ]);
    }

    /**
     * Get a single tour guide.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $guide = TourGuide::find($id);
        
        if (!$guide) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tour guide not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $guide
        ]);
    }

    /**
     * Create a new tour guide (admin only).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'photo' => ['required', 'string'],
            'description' => ['required', 'string'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'location' => ['required', 'string', 'max:255'],
            'experience_years' => ['required', 'integer', 'min:0'],
            'languages' => ['required', 'string'],
            'hire_cost' => ['required', 'numeric', 'min:0'],
            'phone' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
        ]);

        $guide = TourGuide::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Tour guide created successfully',
            'data' => $guide
        ], 201);
    }

    /**
     * Update a tour guide (admin only).
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $guide = TourGuide::find($id);
        
        if (!$guide) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tour guide not found'
            ], 404);
        }

        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'photo' => ['sometimes', 'string'],
            'description' => ['sometimes', 'string'],
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'location' => ['sometimes', 'string', 'max:255'],
            'experience_years' => ['sometimes', 'integer', 'min:0'],
            'languages' => ['sometimes', 'string'],
            'hire_cost' => ['sometimes', 'numeric', 'min:0'],
            'phone' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
        ]);

        $guide->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Tour guide updated successfully',
            'data' => $guide
        ]);
    }

    /**
     * Delete a tour guide (admin only).
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $guide = TourGuide::find($id);
        
        if (!$guide) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tour guide not found'
            ], 404);
        }

        $guide->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tour guide deleted successfully'
        ]);
    }
}
