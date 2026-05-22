<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AvisClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur gérant les avis clients : listing, création et analyses statistiques.
 */
class AvisController extends Controller
{
    /**
     * Retourne une liste paginée des avis, filtrée optionnellement par restaurant ou note.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
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

    /**
     * Crée un nouvel avis client et retourne l'avis créé avec les relations chargées.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
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

    /**
     * Analyse statistique des avis (moyenne, répartition, total, pourcentage positif).
     *
     * @param  Request  $request
     * @return JsonResponse
     */
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
}
