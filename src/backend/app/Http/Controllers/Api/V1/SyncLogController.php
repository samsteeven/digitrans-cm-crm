<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SyncLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SyncLogController extends Controller
{
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

    public function show(SyncLog $syncLog): JsonResponse
    {
        return response()->json($syncLog);
    }
}
