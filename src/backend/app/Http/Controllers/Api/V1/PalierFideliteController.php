<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PalierFidelite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur gérant les paliers de fidélité du programme de fidélisation (CRUD).
 */
class PalierFideliteController extends Controller
{
    /**
     * Retourne la liste de tous les paliers de fidélité triés par points minimum.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(
            PalierFidelite::orderBy('points_minimum')->get()
        );
    }

    /**
     * Crée un nouveau palier de fidélité.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
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

    /**
     * Retourne le détail d'un palier de fidélité.
     *
     * @param  PalierFidelite  $palierFidelite
     * @return JsonResponse
     */
    public function show(PalierFidelite $palierFidelite): JsonResponse
    {
        return response()->json($palierFidelite);
    }

    /**
     * Met à jour un palier de fidélité.
     *
     * @param  Request  $request
     * @param  PalierFidelite  $palierFidelite
     * @return JsonResponse
     */
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

    /**
     * Supprime un palier de fidélité.
     *
     * @param  PalierFidelite  $palierFidelite
     * @return JsonResponse
     */
    public function destroy(PalierFidelite $palierFidelite): JsonResponse
    {
        $palierFidelite->delete();

        return response()->json(['message' => 'Palier supprimé']);
    }
}
