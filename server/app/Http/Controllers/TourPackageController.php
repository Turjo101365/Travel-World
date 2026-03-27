<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TourPackage;

class TourPackageController extends Controller
{
    public function index()
    {
        return response()->json(TourPackage::orderBy('created_at', 'desc')->get());
    }

    public function show($id)
    {
        $package = TourPackage::findOrFail($id);
        return response()->json($package);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
            'image_url' => 'nullable|string'
        ]);

        $package = TourPackage::create($validated);
        return response()->json($package, 201);
    }

    public function update(Request $request, $id)
    {
        $package = TourPackage::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'duration' => 'sometimes|required|integer|min:1',
            'location' => 'sometimes|required|string|max:255',
            'max_participants' => 'sometimes|required|integer|min:1',
            'image_url' => 'nullable|string'
        ]);

        $package->update($validated);
        return response()->json($package);
    }

    public function destroy($id)
    {
        $package = TourPackage::findOrFail($id);
        $package->delete();
        return response()->json(['message' => 'Tour package deleted']);
    }
}
