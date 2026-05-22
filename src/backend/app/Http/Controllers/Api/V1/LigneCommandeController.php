<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\LigneCommande;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LigneCommandeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = LigneCommande::with(['commande:id,statut', 'plat:id,nom,prix_unitaire']);

        if ($commandeId = $request->get('commande_id')) {
            $query->where('commande_id', $commandeId);
        }

        if ($platId = $request->get('plat_id')) {
            $query->where('plat_id', $platId);
        }

        $lignes = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($lignes);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'commande_id' => 'required|exists:commandes,id',
            'plat_id' => 'required|exists:plats,id',
            'quantite' => 'required|integer|min:1',
            'prix_unitaire' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['sous_total'] = $validated['quantite'] * $validated['prix_unitaire'];

        $ligne = LigneCommande::create($validated);
        $ligne->load(['commande:id,statut', 'plat:id,nom,prix_unitaire']);

        return response()->json($ligne, 201);
    }

    public function show(LigneCommande $ligneCommande): JsonResponse
    {
        $ligneCommande->load(['commande', 'plat.categorie']);

        return response()->json($ligneCommande);
    }

    public function update(Request $request, LigneCommande $ligneCommande): JsonResponse
    {
        $validated = $request->validate([
            'quantite' => 'sometimes|integer|min:1',
            'prix_unitaire' => 'sometimes|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['quantite']) || isset($validated['prix_unitaire'])) {
            $quantite = $validated['quantite'] ?? $ligneCommande->quantite;
            $prix = $validated['prix_unitaire'] ?? $ligneCommande->prix_unitaire;
            $validated['sous_total'] = $quantite * $prix;
        }

        $ligneCommande->update($validated);
        $ligneCommande->load(['commande:id,statut', 'plat:id,nom,prix_unitaire']);

        return response()->json($ligneCommande);
    }

    public function destroy(LigneCommande $ligneCommande): JsonResponse
    {
        $ligneCommande->delete();

        return response()->json(['message' => 'Ligne de commande supprimée']);
    }
}
