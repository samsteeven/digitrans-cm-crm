<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SyncLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur pour la consultation des journaux de synchronisation.
 * Permet de lister et filtrer l'historique des synchronisations entre le système local et les API distantes.
 */
class SyncLogController extends Controller
{
    /**
     * Liste paginée des logs de synchronisation.
     * Filtrable par entite_type et est_synchronise.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = SyncLog::query();

        if ($entiteType = $request->get('entite_type')) {
            $query->where('entite_type', $entiteType);
        }

        $estSynchro = $request->get('est_synchronise');
        if ($estSynchro !== null) {
            $query->where('est_synchronise', filter_var($estSynchro, FILTER_VALIDATE_BOOLEAN));
        }

        $logs = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 50));

        return response()->json($logs);
    }

    /**
     * Affiche les détails d'un log de synchronisation spécifique.
     *
     * @param SyncLog $syncLog
     * @return JsonResponse
     */
    public function show(SyncLog $syncLog): JsonResponse
    {
        return response()->json($syncLog);
    }
}
