<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Client;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function kpi(Request $request): JsonResponse
    {
        $restaurantId = $request->get('restaurant_id');
        $periode = $request->get('periode', 'mois'); // jour, semaine, mois, an

        $cacheKey = "dashboard:kpi:{$periode}:" . ($restaurantId ?? 'global');

        $data = Cache::remember($cacheKey, 3600, function () use ($restaurantId, $periode) {
            $query = Commande::query();

            if ($restaurantId) {
                $query->where('restaurant_id', $restaurantId);
            }

            $dateDebut = match ($periode) {
                'jour' => now()->startOfDay(),
                'semaine' => now()->startOfWeek(),
                'an' => now()->startOfYear(),
                default => now()->startOfMonth(),
            };

            $query->where('created_at', '>=', $dateDebut);

            return [
                'chiffre_affaires' => (float) $query->sum('montant_total'),
                'total_commandes' => $query->count(),
                'clients_servis' => $query->distinct('client_id')->count('client_id'),
                'panier_moyen' => (float) $query->avg('montant_total') ?? 0,
                'commandes_par_statut' => Commande::selectRaw('statut, COUNT(*) as total')
                    ->where('created_at', '>=', $dateDebut)
                    ->when($restaurantId, fn($q) => $q->where('restaurant_id', $restaurantId))
                    ->groupBy('statut')
                    ->pluck('total', 'statut'),
                'note_moyenne' => (float) DB::table('avis_clients')
                    ->where('created_at', '>=', $dateDebut)
                    ->when($restaurantId, fn($q) => $q->where('restaurant_id', $restaurantId))
                    ->avg('note') ?? 0,
            ];
        });

        return response()->json($data);
    }

    public function evolution(Request $request): JsonResponse
    {
        $restaurantId = $request->get('restaurant_id');
        $mois = $request->get('mois', 6);

        $query = Commande::selectRaw(
            "DATE_TRUNC('month', created_at) as mois,
            COUNT(*) as total_commandes,
            SUM(montant_total) as chiffre_affaires"
        )->where('created_at', '>=', now()->subMonths($mois));

        if ($restaurantId) {
            $query->where('restaurant_id', $restaurantId);
        }

        $evolution = $query->groupBy('mois')
            ->orderBy('mois')
            ->get();

        return response()->json($evolution);
    }

    public function restaurants(): JsonResponse
    {
        $stats = Restaurant::withCount(['commandes', 'avis'])
            ->withAvg('avis', 'note')
            ->get()
            ->map(function ($r) {
                $r->chiffre_affaires = (float) Commande::where('restaurant_id', $r->id)
                    ->whereMonth('created_at', now()->month)
                    ->sum('montant_total');

                return $r;
            });

        return response()->json($stats);
    }

    public function topClients(): JsonResponse
    {
        $top = Client::withCount('commandes')
            ->withSum('commandes', 'montant_total')
            ->orderByDesc('commandes_sum_montant_total')
            ->limit(10)
            ->get();

        return response()->json($top);
    }
}
