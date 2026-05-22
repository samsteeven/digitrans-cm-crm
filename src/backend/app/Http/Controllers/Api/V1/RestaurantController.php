<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Restaurant::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('ville', 'like', "%{$search}%")
                  ->orWhere('quartier', 'like', "%{$search}%");
            });
        }

        if ($ville = $request->get('ville')) {
            $query->where('ville', $ville);
        }

        $estActif = $request->get('est_actif');
        if ($estActif !== null) {
            $query->where('est_actif', filter_var($estActif, FILTER_VALIDATE_BOOLEAN));
        }

        $restaurants = $query->withCount('commandes', 'avis')
            ->orderBy('nom')
            ->paginate($request->get('per_page', 15));

        return response()->json($restaurants);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'ville' => 'required|string|max:50',
            'quartier' => 'nullable|string|max:100',
            'adresse' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'est_actif' => 'boolean',
            'capacite' => 'nullable|integer|min:1',
        ]);

        $restaurant = Restaurant::create($validated);

        return response()->json($restaurant, 201);
    }

    public function show(Restaurant $restaurant): JsonResponse
    {
        $restaurant->loadCount('commandes', 'avis');
        $restaurant->load(['commandes' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return response()->json($restaurant);
    }

    public function update(Request $request, Restaurant $restaurant): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:100',
            'ville' => 'sometimes|string|max:50',
            'quartier' => 'nullable|string|max:100',
            'adresse' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'est_actif' => 'boolean',
            'capacite' => 'nullable|integer|min:1',
        ]);

        $restaurant->update($validated);

        return response()->json($restaurant);
    }

    public function destroy(Restaurant $restaurant): JsonResponse
    {
        if ($restaurant->commandes()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer : ce restaurant a des commandes associées.',
            ], 422);
        }

        $restaurant->delete();

        return response()->json(['message' => 'Restaurant supprimé']);
    }
}
