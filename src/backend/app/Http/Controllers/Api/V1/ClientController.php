<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Gestion des clients.
 *
 * Permet le CRUD complet des clients ainsi que le calcul de statistiques
 * (total, répartition par segment, fidèles, nouveaux du mois).
 * Les listes sont mises en cache pour optimiser les performances.
 */
class ClientController extends Controller
{
    /**
     * Liste paginée des clients avec filtres.
     *
     * Supporte la recherche par nom, prénom ou email, le filtrage par segment,
     * et la pagination personnalisable. Le résultat est mis en cache 15 minutes.
     *
     * @param Request $request La requête entrante avec les paramètres optionnels : search, segment, per_page, page.
     * @return JsonResponse La liste paginée des clients (format tableau).
     */
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'clients:index:' . md5(json_encode($request->only(['search', 'segment', 'per_page', 'page'])));

        $clients = Cache::remember($cacheKey, 900, function () use ($request) {
            $query = Client::query();

            if ($search = $request->get('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($segment = $request->get('segment')) {
                $query->where('segment', $segment);
            }

            return $query->withCount('commandes')
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15))
                ->toArray();
        });

        return response()->json($clients);
    }

    /**
     * Crée un nouveau client.
     *
     * Valide les données et crée le client en base. Vide le cache des clients
     * pour forcer le rechargement des listes.
     *
     * @param Request $request La requête entrante avec les champs : nom, prenom, email, telephone, date_naissance, preferences, notes.
     * @return JsonResponse Le client créé avec un statut HTTP 201.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'email' => 'required|email|unique:clients,email',
            'telephone' => 'nullable|string|max:20',
            'date_naissance' => 'nullable|date',
            'preferences' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $client = Client::create($validated);

        Cache::tags(['clients'])->flush();

        return response()->json($client, 201);
    }

    /**
     * Affiche un client avec ses relations.
     *
     * Charge les 10 dernières commandes du client (avec leur restaurant),
     * ainsi que ses avis.
     *
     * @param Client $client Le client à afficher (injection de modèle).
     * @return JsonResponse Les détails du client avec ses relations.
     */
    public function show(Client $client): JsonResponse
    {
        $client->load(['commandes' => function ($query) {
            $query->latest()->limit(10);
        }, 'commandes.restaurant', 'avis']);

        return response()->json($client);
    }

    /**
     * Met à jour un client existant.
     *
     * Valide les champs fournis (mise à jour partielle) et enregistre
     * les modifications. Vide le cache des clients.
     *
     * @param Request $request La requête entrante avec les champs optionnels à modifier.
     * @param Client $client Le client à mettre à jour.
     * @return JsonResponse Le client mis à jour.
     */
    public function update(Request $request, Client $client): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:50',
            'prenom' => 'sometimes|string|max:50',
            'email' => 'sometimes|email|unique:clients,email,' . $client->id,
            'telephone' => 'nullable|string|max:20',
            'date_naissance' => 'nullable|date',
            'segment' => 'nullable|in:standard,premium,vip',
            'preferences' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $client->update($validated);

        Cache::tags(['clients'])->flush();

        return response()->json($client);
    }

    public function destroy(Client $client): JsonResponse
    {
        $client->delete();

        Cache::tags(['clients'])->flush();

        return response()->json(['message' => 'Client supprimé'], 200);
    }

    public function statistiques(): JsonResponse
    {
        $stats = Cache::remember('clients:statistiques', 900, function () {
            return [
                'total' => Client::count(),
                'par_segment' => Client::selectRaw('segment, COUNT(*) as total')
                    ->groupBy('segment')->pluck('total', 'segment')
                    ->toArray(),
                'fideles' => Client::where('est_fidelite', true)->count(),
                'nouveaux_mois' => Client::whereMonth('created_at', now()->month)->count(),
            ];
        });

        return response()->json($stats);
    }
}
