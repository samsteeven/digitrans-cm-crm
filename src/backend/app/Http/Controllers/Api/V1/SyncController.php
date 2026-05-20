<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AvisClient;
use App\Models\Client;
use App\Models\Commande;
use App\Models\SyncLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Synchronisation offline-first pour les zones à faible connectivité.
 *
 * Reçoit les entités créées/modifiées hors ligne (commandes, avis, clients)
 * et les intègre dans la base de données centrale.
 * Maintient un journal de synchronisation pour le suivi.
 */
class SyncController extends Controller
{
    public function synchroniser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'entites' => 'required|array',
            'entites.*.type' => 'required|in:commande,avis,client',
            'entites.*.action' => 'required|in:create,update',
            'entites.*.payload' => 'required|array',
        ]);

        $resultats = [];

        DB::beginTransaction();
        try {
            foreach ($validated['entites'] as $entite) {
                $resultat = match ($entite['type']) {
                    'commande' => $this->syncCommande($entite['payload'], $entite['action']),
                    'avis' => $this->syncAvis($entite['payload'], $entite['action']),
                    'client' => $this->syncClient($entite['payload'], $entite['action']),
                };

                SyncLog::create([
                    'entite_type' => $entite['type'],
                    'entite_id' => $resultat['id'],
                    'action' => $entite['action'],
                    'payload' => $entite['payload'],
                    'est_synchronise' => true,
                    'synced_at' => now(),
                ]);

                $resultats[] = $resultat;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'synchronises' => count($resultats),
                'resultats' => $resultats,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur de synchronisation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function syncCommande(array $payload, string $action): array
    {
        if ($action === 'create') {
            $commande = Commande::create([
                'client_id' => $payload['client_id'],
                'restaurant_id' => $payload['restaurant_id'],
                'montant_total' => $payload['montant_total'],
                'type_commande' => $payload['type_commande'] ?? 'sur_place',
                'notes' => $payload['notes'] ?? null,
                'est_synchronise' => true,
                'synced_at' => now(),
            ]);

            return ['id' => $commande->id, 'type' => 'commande', 'action' => 'created'];
        }

        if ($action === 'update' && isset($payload['id'])) {
            $commande = Commande::find($payload['id']);
            if ($commande) {
                $commande->update([
                    'statut' => $payload['statut'] ?? $commande->statut,
                    'notes' => $payload['notes'] ?? $commande->notes,
                    'est_synchronise' => true,
                    'synced_at' => now(),
                ]);

                return ['id' => $commande->id, 'type' => 'commande', 'action' => 'updated'];
            }
        }

        return ['id' => null, 'type' => 'commande', 'action' => 'ignored'];
    }

    private function syncAvis(array $payload, string $action): array
    {
        $avis = AvisClient::updateOrCreate(
            [
                'commande_id' => $payload['commande_id'],
                'client_id' => $payload['client_id'],
            ],
            [
                'restaurant_id' => $payload['restaurant_id'],
                'note' => $payload['note'],
                'commentaire' => $payload['commentaire'] ?? null,
            ]
        );

        return ['id' => $avis->id, 'type' => 'avis', 'action' => $action === 'create' ? 'created' : 'updated'];
    }

    private function syncClient(array $payload, string $action): array
    {
        $client = Client::updateOrCreate(
            ['email' => $payload['email']],
            [
                'nom' => $payload['nom'],
                'prenom' => $payload['prenom'],
                'telephone' => $payload['telephone'] ?? null,
            ]
        );

        return ['id' => $client->id, 'type' => 'client', 'action' => $action === 'create' ? 'created' : 'updated'];
    }

    public function pending(): JsonResponse
    {
        $pending = SyncLog::where('est_synchronise', false)
            ->orderBy('created_at')
            ->get();

        return response()->json($pending);
    }
}
