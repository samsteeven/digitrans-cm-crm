<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TransactionFidelite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur pour la gestion des transactions de fidélité.
 * Permet de lister et consulter les transactions de points des clients.
 */
class TransactionFideliteController extends Controller
{
    /**
     * Liste paginée des transactions de fidélité.
     * Filtrable par client_id et type.
     *
     * @param Request $request
     * @return JsonResponse
     */
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

    /**
     * Affiche les détails d'une transaction de fidélité spécifique.
     *
     * @param TransactionFidelite $transactionFidelite
     * @return JsonResponse
     */
    public function show(TransactionFidelite $transactionFidelite): JsonResponse
    {
        $transactionFidelite->load('client:id,nom,prenom');

        return response()->json($transactionFidelite);
    }
}
