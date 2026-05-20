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
            $dateDebut = match ($periode) {
                'jour' => now()->startOfDay(),
                'semaine' => now()->startOfWeek(),
                'an' => now()->startOfYear(),
                default => now()->startOfMonth(),
            };

            $baseQuery = Commande::query()
                ->where('created_at', '>=', $dateDebut);

            if ($restaurantId) {
                $baseQuery->where('restaurant_id', $restaurantId);
            }

            $totalCommandes = (clone $baseQuery)->count();
            $chiffreAffaires = (float) max(0, (clone $baseQuery)->sum('montant_total'));
            $clientsServis = (int) (clone $baseQuery)->distinct()->count('client_id');
            $panierMoyen = $totalCommandes > 0 ? (float) ($chiffreAffaires / $totalCommandes) : 0.0;

            return [
                'chiffre_affaires' => $chiffreAffaires,
                'total_commandes' => $totalCommandes,
                'clients_servis' => $clientsServis,
                'panier_moyen' => $panierMoyen,
                'commandes_par_statut' => Commande::selectRaw('statut, COUNT(*) as total')
                    ->where('created_at', '>=', $dateDebut)
                    ->when($restaurantId, fn($q) => $q->where('restaurant_id', $restaurantId))
                    ->groupBy('statut')
                    ->pluck('total', 'statut')
                    ->toArray(),
                'note_moyenne' => (float) (DB::table('avis_clients')
                    ->where('created_at', '>=', $dateDebut)
                    ->when($restaurantId, fn($q) => $q->where('restaurant_id', $restaurantId))
                    ->avg('note') ?? 0),
            ];
        });

        return response()->json($data);
    }

    public function evolution(Request $request): JsonResponse
    {
        $restaurantId = $request->get('restaurant_id');
        $mois = $request->get('mois', 6);

        $cacheKey = "dashboard:evolution:{$mois}:" . ($restaurantId ?? 'global');

        $evolution = Cache::remember($cacheKey, 3600, function () use ($restaurantId, $mois) {
            $driver = DB::connection()->getDriverName();
            $moisExpr = match ($driver) {
                'sqlite' => "strftime('%Y-%m-01 00:00:00', created_at)",
                'mysql' => "DATE_FORMAT(created_at, '%Y-%m-01 00:00:00')",
                default => "DATE_TRUNC('month', created_at)",
            };

            $query = Commande::selectRaw(
                "{$moisExpr} as mois,
                COUNT(*) as total_commandes,
                SUM(montant_total) as chiffre_affaires"
            )->where('created_at', '>=', now()->subMonths($mois));

            if ($restaurantId) {
                $query->where('restaurant_id', $restaurantId);
            }

            return $query->groupBy('mois')
                ->orderBy('mois')
                ->get()
                ->toArray();
        });

        return response()->json($evolution);
    }

    public function restaurants(): JsonResponse
    {
        $stats = Cache::remember('dashboard:restaurants', 3600, function () {
            return Restaurant::withCount(['commandes', 'avis'])
            ->withAvg('avis', 'note')
            ->get()
            ->map(function ($r) {
                $r->chiffre_affaires = (float) Commande::where('restaurant_id', $r->id)
                    ->whereMonth('created_at', now()->month)
                    ->sum('montant_total');

                return $r;
            })
            ->toArray();
        });

        return response()->json($stats);
    }

    public function topClients(): JsonResponse
    {
        $top = Cache::remember('dashboard:top-clients', 3600, function () {
            return Client::withCount('commandes')
            ->withSum('commandes', 'montant_total')
            ->orderByDesc('commandes_sum_montant_total')
            ->limit(10)
            ->get()
            ->toArray();
        });

        return response()->json($top);
    }
}
