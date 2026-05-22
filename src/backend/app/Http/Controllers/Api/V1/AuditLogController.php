<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
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

    public function show(AuditLog $auditLog): JsonResponse
    {
        return response()->json($auditLog);
    }
}
