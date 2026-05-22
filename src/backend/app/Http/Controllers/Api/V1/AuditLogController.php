<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur pour la consultation des journaux d'audit.
 * Permet de lister et filtrer les actions effectuées sur les entités du système.
 */
class AuditLogController extends Controller
{
    /**
     * Liste paginée des logs d'audit.
     * Filtrable par entite_type, entite_id et action.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::query();

        if ($entiteType = $request->get('entite_type')) {
            $query->where('entite_type', $entiteType);
        }

        if ($entiteId = $request->get('entite_id')) {
            $query->where('entite_id', $entiteId);
        }

        if ($action = $request->get('action')) {
            $query->where('action', $action);
        }

        $logs = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 50));

        return response()->json($logs);
    }

    /**
     * Affiche les détails d'un log d'audit spécifique.
     *
     * @param AuditLog $auditLog
     * @return JsonResponse
     */
    public function show(AuditLog $auditLog): JsonResponse
    {
        return response()->json($auditLog);
    }
}
