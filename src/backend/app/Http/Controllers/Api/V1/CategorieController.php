<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CategoriePlat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            CategoriePlat::withCount('plats')->orderBy('nom')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:50|unique:categories_plats,nom',
            'description' => 'nullable|string',
        ]);

        $categorie = CategoriePlat::create($validated);

        return response()->json($categorie, 201);
    }

    public function show(CategoriePlat $categorie): JsonResponse
    {
        $categorie->load('plats');

        return response()->json($categorie);
    }

    public function update(Request $request, CategoriePlat $categorie): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:50|unique:categories_plats,nom,' . $categorie->id,
            'description' => 'nullable|string',
        ]);

        $categorie->update($validated);

        return response()->json($categorie);
    }

    public function destroy(CategoriePlat $categorie): JsonResponse
    {
        if ($categorie->plats()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer : cette catégorie contient des plats.',
            ], 422);
        }

        $categorie->delete();

        return response()->json(['message' => 'Catégorie supprimée']);
    }
}
