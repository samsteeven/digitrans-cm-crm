<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

/**
 * Contrôleur pour la gestion des permissions.
 * Permet les opérations CRUD sur les permissions du système via Spatie Permission.
 */
class PermissionController extends Controller
{
    /**
     * Liste toutes les permissions.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(
            Permission::orderBy('name')->get()
        );
    }

    /**
     * Crée une nouvelle permission.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        $permission = Permission::create(['name' => $validated['name']]);

        return response()->json($permission, 201);
    }

    /**
     * Affiche les détails d'une permission spécifique.
     *
     * @param Permission $permission
     * @return JsonResponse
     */
    public function show(Permission $permission): JsonResponse
    {
        return response()->json($permission);
    }

    /**
     * Met à jour une permission existante.
     *
     * @param Request $request
     * @param Permission $permission
     * @return JsonResponse
     */
    public function update(Request $request, Permission $permission): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update($validated);

        return response()->json($permission);
    }

    /**
     * Supprime une permission.
     *
     * @param Permission $permission
     * @return JsonResponse
     */
    public function destroy(Permission $permission): JsonResponse
    {
        $permission->delete();

        return response()->json(['message' => 'Permission supprimée']);
    }
}
