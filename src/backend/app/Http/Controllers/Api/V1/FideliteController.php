<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\TransactionFidelite;
use App\Models\Recompense;
use App\Models\EchangeRecompense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Gestion du programme de fidélité.
 *
 * Permet de consulter les points d'un client, ajouter des points,
 * lister les récompenses disponibles, et échanger des points contre une récompense.
 */
class FideliteController extends Controller
{
    public function points(Client $client): JsonResponse
    {
        $transactions = $client->transactionsFidelite()
            ->latest()
            ->paginate(15);

        return response()->json([
            'client' => $client->only('id', 'nom_complet', 'points_fidelite', 'est_fidelite'),
            'transactions' => $transactions,
        ]);
    }

    public function ajouterPoints(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'commande_id' => 'required|exists:commandes,id',
            'points' => 'required|integer|min:1',
        ]);

        $client = Client::findOrFail($validated['client_id']);
        $soldeAvant = $client->points_fidelite;

        $transaction = TransactionFidelite::create([
            'client_id' => $client->id,
            'commande_id' => $validated['commande_id'],
            'type' => 'gain',
            'points' => $validated['points'],
            'solde_avant' => $soldeAvant,
            'solde_apres' => $soldeAvant + $validated['points'],
            'description' => "Gain de {$validated['points']} points sur commande",
        ]);

        $client->increment('points_fidelite', $validated['points']);
        $client->update(['est_fidelite' => true]);

        return response()->json($transaction, 201);
    }

    public function recompenses(): JsonResponse
    {
        $recompenses = Recompense::where('est_active', true)->get();

        return response()->json($recompenses);
    }

    public function echangerPoints(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'recompense_id' => 'required|exists:recompenses,id',
        ]);

        $client = Client::findOrFail($validated['client_id']);
        $recompense = Recompense::findOrFail($validated['recompense_id']);

        if ($client->points_fidelite < $recompense->points_requis) {
            return response()->json([
                'message' => 'Points insuffisants',
                'disponible' => $client->points_fidelite,
                'requis' => $recompense->points_requis,
            ], 422);
        }

        if ($recompense->stock <= 0) {
            return response()->json(['message' => 'Récompense épuisée'], 422);
        }

        $soldeAvant = $client->points_fidelite;

        $echange = EchangeRecompense::create([
            'client_id' => $client->id,
            'recompense_id' => $recompense->id,
            'points_utilises' => $recompense->points_requis,
            'code_utilisation' => strtoupper('CRM-' . bin2hex(random_bytes(4))),
            'expire_le' => now()->addMonths(3),
        ]);

        TransactionFidelite::create([
            'client_id' => $client->id,
            'type' => 'echange',
            'points' => -$recompense->points_requis,
            'solde_avant' => $soldeAvant,
            'solde_apres' => $soldeAvant - $recompense->points_requis,
            'description' => "Échange: {$recompense->nom}",
        ]);

        $client->decrement('points_fidelite', $recompense->points_requis);
        $recompense->decrement('stock');

        return response()->json($echange, 201);
    }
}
