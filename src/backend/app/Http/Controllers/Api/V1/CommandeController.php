<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\LigneCommande;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Commande::with(['client:id,nom,prenom', 'restaurant:id,nom,ville']);

        if ($clientId = $request->get('client_id')) {
            $query->where('client_id', $clientId);
        }

        if ($restaurantId = $request->get('restaurant_id')) {
            $query->where('restaurant_id', $restaurantId);
        }

        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }

        if ($dateDebut = $request->get('date_debut')) {
            $query->whereDate('created_at', '>=', $dateDebut);
        }

        if ($dateFin = $request->get('date_fin')) {
            $query->whereDate('created_at', '<=', $dateFin);
        }

        $commandes = $query->orderBy('created_at', 'desc')
            ->cursorPaginate($request->get('per_page', 15));

        return response()->json($commandes);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'restaurant_id' => 'required|exists:restaurants,id',
            'type_commande' => 'required|in:sur_place,a_emporter,livraison',
            'notes' => 'nullable|string',
            'est_synchronise' => 'boolean',
            'lignes' => 'required|array|min:1',
            'lignes.*.plat_id' => 'required|exists:plats,id',
            'lignes.*.quantite' => 'required|integer|min:1',
            'lignes.*.notes' => 'nullable|string',
        ]);

        $montantTotal = 0;
        $lignesData = [];

        foreach ($validated['lignes'] as $ligne) {
            $plat = \App\Models\Plat::findOrFail($ligne['plat_id']);
            $sousTotal = $plat->prix_unitaire * $ligne['quantite'];
            $montantTotal += $sousTotal;

            $lignesData[] = new LigneCommande([
                'plat_id' => $plat->id,
                'quantite' => $ligne['quantite'],
                'prix_unitaire' => $plat->prix_unitaire,
                'sous_total' => $sousTotal,
                'notes' => $ligne['notes'] ?? null,
            ]);
        }

        $commande = Commande::create([
            'client_id' => $validated['client_id'],
            'restaurant_id' => $validated['restaurant_id'],
            'montant_total' => $montantTotal,
            'type_commande' => $validated['type_commande'],
            'notes' => $validated['notes'] ?? null,
            'est_synchronise' => $request->boolean('est_synchronise', true),
        ]);

        $commande->ligneCommandes()->saveMany($lignesData);

        $commande->load(['client:id,nom,prenom', 'restaurant:id,nom', 'ligneCommandes.plat']);

        return response()->json($commande, 201);
    }

    public function show(Commande $commande): JsonResponse
    {
        $commande->load(['client', 'restaurant', 'ligneCommandes.plat.categorie', 'avis']);

        return response()->json($commande);
    }

    public function updateStatut(Request $request, Commande $commande): JsonResponse
    {
        $validated = $request->validate([
            'statut' => 'required|in:en_attente,confirmee,en_preparation,prete,livree,annulee',
        ]);

        $commande->update($validated);

        return response()->json($commande);
    }
}
