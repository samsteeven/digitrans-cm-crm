<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PalierFidelite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PalierFideliteController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            PalierFidelite::orderBy('points_minimum')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:50|unique:palier_fidelites,nom',
            'points_minimum' => 'required|integer|min:0',
            'points_maximum' => 'nullable|integer|gt:points_minimum',
            'description' => 'nullable|string',
        ]);

        $palier = PalierFidelite::create($validated);

        return response()->json($palier, 201);
    }

    public function show(PalierFidelite $palierFidelite): JsonResponse
    {
        return response()->json($palierFidelite);
    }

    public function update(Request $request, PalierFidelite $palierFidelite): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:50|unique:palier_fidelites,nom,' . $palierFidelite->id,
            'points_minimum' => 'sometimes|integer|min:0',
            'points_maximum' => 'nullable|integer|gt:points_minimum',
            'description' => 'nullable|string',
        ]);

        $palierFidelite->update($validated);

        return response()->json($palierFidelite);
    }

    public function destroy(PalierFidelite $palierFidelite): JsonResponse
    {
        $palierFidelite->delete();

        return response()->json(['message' => 'Palier supprimé']);
    }
}
