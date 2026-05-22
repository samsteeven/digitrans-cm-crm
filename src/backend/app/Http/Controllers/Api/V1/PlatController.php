<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Plat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Contrôleur gérant les plats (CRUD) avec mise en cache des listes.
 */
class PlatController extends Controller
{
    /**
     * Retourne une liste paginée des plats avec filtres (catégorie, recherche, disponibilité) et mise en cache.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'plats:index:' . md5(json_encode($request->only(['search', 'categorie_id', 'disponible', 'per_page', 'page'])));

        $plats = Cache::remember($cacheKey, 1800, function () use ($request) {
            $query = Plat::with('categorie:id,nom');

            if ($categorieId = $request->get('categorie_id')) {
                $query->where('categorie_id', $categorieId);
            }

            if ($search = $request->get('search')) {
                $query->where('nom', 'like', "%{$search}%");
            }

            $disponible = $request->get('disponible');
            if ($disponible !== null) {
                $query->where('disponible', filter_var($disponible, FILTER_VALIDATE_BOOLEAN));
            }

            return $query->orderBy('nom')->paginate($request->get('per_page', 20))->toArray();
        });

        return response()->json($plats);
    }

    /**
     * Crée un plat et vide le cache des plats.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'categorie_id' => 'required|exists:categories_plats,id',
            'nom' => 'required|string|max:100',
            'description' => 'nullable|string',
            'prix_unitaire' => 'required|numeric|min:0',
            'devise' => 'sometimes|string|max:5',
            'disponible' => 'boolean',
            'image_url' => 'nullable|url',
        ]);

        $plat = Plat::create($validated);
        $plat->load('categorie:id,nom');

        Cache::tags(['plats'])->flush();

        return response()->json($plat, 201);
    }

    /**
     * Retourne le détail d'un plat avec sa catégorie.
     *
     * @param  Plat  $plat
     * @return JsonResponse
     */
    public function show(Plat $plat): JsonResponse
    {
        $plat->load('categorie');

        return response()->json($plat);
    }

    /**
     * Met à jour un plat et vide le cache des plats.
     *
     * @param  Request  $request
     * @param  Plat  $plat
     * @return JsonResponse
     */
    public function update(Request $request, Plat $plat): JsonResponse
    {
        $validated = $request->validate([
            'categorie_id' => 'sometimes|exists:categories_plats,id',
            'nom' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'prix_unitaire' => 'sometimes|numeric|min:0',
            'devise' => 'sometimes|string|max:5',
            'disponible' => 'boolean',
            'image_url' => 'nullable|url',
        ]);

        $plat->update($validated);

        Cache::tags(['plats'])->flush();

        return response()->json($plat);
    }

    /**
     * Supprime un plat et vide le cache des plats.
     *
     * @param  Plat  $plat
     * @return JsonResponse
     */
    public function destroy(Plat $plat): JsonResponse
    {
        $plat->delete();

        Cache::tags(['plats'])->flush();

        return response()->json(['message' => 'Plat supprimé']);
    }
}
