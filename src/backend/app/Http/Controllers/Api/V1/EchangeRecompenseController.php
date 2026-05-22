<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\EchangeRecompense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EchangeRecompenseController extends Controller
{
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

    public function show(EchangeRecompense $echangeRecompense): JsonResponse
    {
        $echangeRecompense->load(['client:id,nom,prenom', 'recompense']);

        return response()->json($echangeRecompense);
    }

    public function update(Request $request, EchangeRecompense $echangeRecompense): JsonResponse
    {
        $validated = $request->validate([
            'statut' => 'required|in:valide,utilise,expire,annule',
        ]);

        $echangeRecompense->update($validated);

        return response()->json($echangeRecompense);
    }

    public function destroy(EchangeRecompense $echangeRecompense): JsonResponse
    {
        $echangeRecompense->delete();

        return response()->json(['message' => 'Échange supprimé']);
    }
}
