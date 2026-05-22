<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TransactionFidelite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionFideliteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = TransactionFidelite::with('client:id,nom,prenom');

        if ($clientId = $request->get('client_id')) {
            $query->where('client_id', $clientId);
        }

        if ($type = $request->get('type')) {
            $query->where('type', $type);
        }

        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($transactions);
    }

    public function show(TransactionFidelite $transactionFidelite): JsonResponse
    {
        $transactionFidelite->load('client:id,nom,prenom');

        return response()->json($transactionFidelite);
    }
}
