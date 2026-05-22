<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\EchangeRecompense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur pour la gestion des échanges de récompenses.
 * Permet de lister, consulter, mettre à jour et supprimer les échanges de points effectués par les clients.
 */
class EchangeRecompenseController extends Controller
{
    /**
     * Liste paginée des échanges de récompenses.
     * Filtrable par client_id et statut.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = EchangeRecompense::with([
            'client:id,nom,prenom',
            'recompense:id,nom,points_requis',
        ]);

        if ($clientId = $request->get('client_id')) {
            $query->where('client_id', $clientId);
        }

        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }

        $echanges = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($echanges);
    }

    /**
     * Affiche les détails d'un échange de récompense spécifique.
     *
     * @param EchangeRecompense $echangeRecompense
     * @return JsonResponse
     */
    public function show(EchangeRecompense $echangeRecompense): JsonResponse
    {
        $echangeRecompense->load(['client:id,nom,prenom', 'recompense']);

        return response()->json($echangeRecompense);
    }

    /**
     * Met à jour le statut d'un échange de récompense.
     *
     * @param Request $request
     * @param EchangeRecompense $echangeRecompense
     * @return JsonResponse
     */
    public function update(Request $request, EchangeRecompense $echangeRecompense): JsonResponse
    {
        $validated = $request->validate([
            'statut' => 'required|in:valide,utilise,expire,annule',
        ]);

        $echangeRecompense->update($validated);

        return response()->json($echangeRecompense);
    }

    /**
     * Supprime un échange de récompense.
     *
     * @param EchangeRecompense $echangeRecompense
     * @return JsonResponse
     */
    public function destroy(EchangeRecompense $echangeRecompense): JsonResponse
    {
        $echangeRecompense->delete();

        return response()->json(['message' => 'Échange supprimé']);
    }
}
