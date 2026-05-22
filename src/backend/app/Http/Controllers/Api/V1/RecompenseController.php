<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Recompense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur gérant les récompenses du programme de fidélité (CRUD).
 */
class RecompenseController extends Controller
{
    /**
     * Retourne une liste paginée des récompenses, filtrée optionnellement par statut actif.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Recompense::query();

        if ($request->get('est_active') !== null) {
            $query->where('est_active', filter_var($request->get('est_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $recompenses = $query->orderBy('points_requis')
            ->paginate($request->get('per_page', 20));

        return response()->json($recompenses);
    }

    /**
     * Crée une nouvelle récompense.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'description' => 'nullable|string',
            'points_requis' => 'required|integer|min:1',
            'type' => 'sometimes|string|max:50',
            'valeur' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'est_active' => 'boolean',
        ]);

        $recompense = Recompense::create($validated);

        return response()->json($recompense, 201);
    }

    /**
     * Retourne le détail d'une récompense.
     *
     * @param  Recompense  $recompense
     * @return JsonResponse
     */
    public function show(Recompense $recompense): JsonResponse
    {
        return response()->json($recompense);
    }

    /**
     * Met à jour une récompense.
     *
     * @param  Request  $request
     * @param  Recompense  $recompense
     * @return JsonResponse
     */
    public function update(Request $request, Recompense $recompense): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'points_requis' => 'sometimes|integer|min:1',
            'type' => 'sometimes|string|max:50',
            'valeur' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'est_active' => 'boolean',
        ]);

        $recompense->update($validated);

        return response()->json($recompense);
    }

    /**
     * Supprime une récompense.
     *
     * @param  Recompense  $recompense
     * @return JsonResponse
     */
    public function destroy(Recompense $recompense): JsonResponse
    {
        $recompense->delete();

        return response()->json(['message' => 'Récompense supprimée']);
    }
}
