<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * Contrôleur pour la gestion des rôles.
 * Permet les opérations CRUD sur les rôles et l'attribution de permissions via Spatie Permission.
 */
class RoleController extends Controller
{
    /**
     * Liste tous les rôles avec leurs permissions associées.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(
            Role::with('permissions')->orderBy('name')->get()
        );
    }

    /**
     * Crée un nouveau rôle avec des permissions optionnelles.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        $role->load('permissions');

        return response()->json($role, 201);
    }

    /**
     * Affiche les détails d'un rôle spécifique avec ses permissions.
     *
     * @param Role $role
     * @return JsonResponse
     */
    public function show(Role $role): JsonResponse
    {
        $role->load('permissions');

        return response()->json($role);
    }

    /**
     * Met à jour un rôle existant et ses permissions associées.
     *
     * @param Request $request
     * @param Role $role
     * @return JsonResponse
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'sometimes|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        if (isset($validated['name'])) {
            $role->update(['name' => $validated['name']]);
        }

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        $role->load('permissions');

        return response()->json($role);
    }

    /**
     * Supprime un rôle, à l'exception du rôle "Super Admin".
     *
     * @param Role $role
     * @return JsonResponse
     */
    public function destroy(Role $role): JsonResponse
    {
        if ($role->name === 'Super Admin') {
            return response()->json(['message' => 'Impossible de supprimer le rôle Super Admin'], 422);
        }

        $role->delete();

        return response()->json(['message' => 'Rôle supprimé']);
    }
}
