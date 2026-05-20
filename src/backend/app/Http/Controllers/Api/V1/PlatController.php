<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Plat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PlatController extends Controller
{
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

    public function show(Plat $plat): JsonResponse
    {
        $plat->load('categorie');

        return response()->json($plat);
    }

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

    public function destroy(Plat $plat): JsonResponse
    {
        $plat->delete();

        Cache::tags(['plats'])->flush();

        return response()->json(['message' => 'Plat supprimé']);
    }
}
