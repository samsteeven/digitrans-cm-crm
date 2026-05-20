<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AvisClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvisController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AvisClient::with(['client:id,nom,prenom', 'restaurant:id,nom,ville']);

        if ($restaurantId = $request->get('restaurant_id')) {
            $query->where('restaurant_id', $restaurantId);
        }

        if ($note = $request->get('note')) {
            $query->where('note', $note);
        }

        $avis = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($avis);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'commande_id' => 'required|exists:commandes,id',
            'restaurant_id' => 'required|exists:restaurants,id',
            'note' => 'required|integer|between:1,5',
            'commentaire' => 'nullable|string|max:1000',
        ]);

        $avis = AvisClient::create($validated);

        $avis->load('client:id,nom,prenom');

        return response()->json($avis, 201);
    }

    public function analyse(Request $request): JsonResponse
    {
        $restaurantId = $request->get('restaurant_id');

        $query = AvisClient::query();
        if ($restaurantId) {
            $query->where('restaurant_id', $restaurantId);
        }

        $analyse = [
            'moyenne' => (float) $query->avg('note'),
            'repartition' => $query->selectRaw('note, COUNT(*) as total')
                ->groupBy('note')
                ->orderBy('note')
                ->pluck('total', 'note'),
            'total_avis' => $query->count(),
            'pourcentage_positif' => round(
                (clone $query)->where('note', '>=', 4)->count() / max($query->count(), 1) * 100,
                1
            ),
        ];

        return response()->json($analyse);
    }

    public function show(AvisClient $avi): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $avi
        ], 200);
    }

    public function update(Request $request, AvisClient $avi): JsonResponse
    {
        $validated = $request->validate([
            'note'        => ['sometimes', 'required', 'integer', 'between:1,5'],
            'commentaire' => ['nullable', 'string', 'max:1000'],
            'est_modere'  => ['sometimes', 'required', 'boolean'],
        ]);

        $avi->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Avis mis à jour avec succès.',
            'data'    => $avi
        ], 200);
    }

    public function destroy(AvisClient $avi): JsonResponse
    {
        $avi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Avis supprimé avec succès.'
        ], 200);
    }
}
