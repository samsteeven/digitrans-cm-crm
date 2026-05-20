<?php

namespace Database\Seeders;

use App\Models\AvisClient;
use App\Models\CategoriePlat;
use App\Models\Client;
use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\PalierFidelite;
use App\Models\Plat;
use App\Models\Recompense;
use App\Models\Restaurant;
use App\Models\TransactionFidelite;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
 * Données de démonstration pour le module CRM SavoirManger.
 *
 * Génère un jeu de données réaliste couvrant la période jan-mai 2026 :
 * - 1 admin, 5 restaurants, 4 paliers, 4 catégories, 10 plats, 5 récompenses
 * - 50 clients segmentés (standard 60%, premium 20%, VIP 20%)
 * - 200 commandes avec lignes, transactions fidélité cumulatives
 * - Avis clients sur ~60% des commandes
 *
 * Les dates sont échelonnées aléatoirement pour simuler une activité progressive.
 */
class DatabaseSeeder extends Seeder
{
    {
        // ── Utilisateur admin ──
        User::create([
            'name' => 'Admin CRM',
            'email' => 'admin@savoirmanager.cm',
            'password' => bcrypt('password'),
        ]);

        // ── 5 Restaurants SavoirManger ──
        $restaurants = collect();
        foreach ([
            ['nom' => 'SavoirManger Bonanjo',     'ville' => 'Douala',   'quartier' => 'Bonanjo'],
            ['nom' => 'SavoirManger Akwa',        'ville' => 'Douala',   'quartier' => 'Akwa'],
            ['nom' => 'SavoirManger Bastos',      'ville' => 'Yaoundé',  'quartier' => 'Bastos'],
            ['nom' => 'SavoirManger Centre',      'ville' => 'Bafoussam','quartier' => 'Centre Ville'],
            ['nom' => 'SavoirManger Garoua',      'ville' => 'Garoua',   'quartier' => 'Marché Central'],
        ] as $r) {
            $restaurants->push(Restaurant::create($r + ['telephone' => '6' . fake()->numerify('########'), 'est_actif' => true]));
        }

        // ── 4 Paliers de fidélité ──
        foreach ([
            ['nom' => 'Bronze',  'points_minimum' => 0,     'points_maximum' => 499,  'description' => '5 % de réduction'],
            ['nom' => 'Argent',  'points_minimum' => 500,   'points_maximum' => 1499, 'description' => '10 % de réduction'],
            ['nom' => 'Or',      'points_minimum' => 1500,  'points_maximum' => 4999, 'description' => '15 % de réduction + plat anniversaire'],
            ['nom' => 'Platine', 'points_minimum' => 5000,  'points_maximum' => null, 'description' => '20 % de réduction + menus exclusifs'],
        ] as $p) {
            PalierFidelite::create($p);
        }

        // ── 4 Catégories de plats ──
        $categories = collect();
        foreach (['Entrées', 'Plats Principaux', 'Desserts', 'Boissons'] as $name) {
            $categories->push(CategoriePlat::create(['nom' => $name]));
        }

        // ── 10 Plats ──
        $plats = collect();
        $platsData = [
            ['nom' => 'Samoussas (6 pcs)',       'prix' => 2500, 'cat' => 0],
            ['nom' => 'Salade César',            'prix' => 3500, 'cat' => 0],
            ['nom' => 'Poulet DG',               'prix' => 6500, 'cat' => 1],
            ['nom' => 'Poisson braisé + banane', 'prix' => 7000, 'cat' => 1],
            ['nom' => 'Ndolé + riz',             'prix' => 5500, 'cat' => 1],
            ['nom' => 'Bœuf sauce arachide',     'prix' => 6000, 'cat' => 1],
            ['nom' => 'Mousse au chocolat',      'prix' => 2500, 'cat' => 2],
            ['nom' => 'Salade de fruits',        'prix' => 2000, 'cat' => 2],
            ['nom' => 'Jus de bissap',           'prix' => 1500, 'cat' => 3],
            ['nom' => 'Café local',              'prix' => 1000, 'cat' => 3],
        ];
        foreach ($platsData as $p) {
            $plats->push(Plat::create([
                'categorie_id'  => $categories[$p['cat']]->id,
                'nom'           => $p['nom'],
                'prix_unitaire' => $p['prix'],
                'disponible'    => true,
            ]));
        }

        // ── 5 Récompenses ──
        foreach ([
            ['nom' => 'Café offert',           'points' => 100,  'valeur' => 1500],
            ['nom' => 'Dessert offert',        'points' => 300,  'valeur' => 3500],
            ['nom' => 'Menu duo -50 %',        'points' => 500,  'valeur' => 5000],
            ['nom' => 'Plat principal offert', 'points' => 800,  'valeur' => 8500],
            ['nom' => 'Menu famille gratuit',  'points' => 1500, 'valeur' => 25000],
        ] as $r) {
            Recompense::create([
                'nom'           => $r['nom'],
                'points_requis' => $r['points'],
                'valeur'        => $r['valeur'],
                'stock'         => 99,
                'est_active'    => true,
            ]);
        }

        // ── 50 Clients ──
        $clients = collect();
        for ($i = 0; $i < 50; $i++) {
            $segment = fake()->randomElement(['standard', 'standard', 'standard', 'premium', 'vip']);
            $points = match ($segment) {
                'vip'     => fake()->numberBetween(1500, 8000),
                'premium' => fake()->numberBetween(500, 1499),
                default   => fake()->numberBetween(0, 499),
            };
            $clients->push(Client::create([
                'nom'             => fake()->lastName(),
                'prenom'          => fake()->firstName(),
                'email'           => fake()->unique()->safeEmail(),
                'telephone'       => '6' . fake()->numerify('########'),
                'segment'         => $segment,
                'est_fidelite'    => $segment !== 'standard',
                'points_fidelite' => $points,
            ]));
        }

        // ── 200 Commandes ──
        $statuts = ['en_attente', 'confirmee', 'en_preparation', 'prete', 'livree'];
        for ($i = 0; $i < 200; $i++) {
            $start = Carbon::parse('2026-01-01');
            $end   = Carbon::parse('2026-05-31');
            $createdAt = Carbon::createFromTimestamp(rand($start->timestamp, $end->timestamp));

            $client     = $clients->random();
            $restaurant = $restaurants->random();
            $montant    = 0;
            $lignes     = [];

            $nbPlats   = rand(1, 4);
            $usedPlats = [];
            for ($j = 0; $j < $nbPlats; $j++) {
                $plat = $plats->random();
                while (in_array($plat->id, $usedPlats) && count($usedPlats) < $plats->count()) {
                    $plat = $plats->random();
                }
                $usedPlats[] = $plat->id;
                $qte         = rand(1, 3);
                $sousTotal   = $plat->prix_unitaire * $qte;
                $montant    += $sousTotal;
                $lignes[]    = new LigneCommande([
                    'plat_id'       => $plat->id,
                    'quantite'      => $qte,
                    'prix_unitaire' => $plat->prix_unitaire,
                    'sous_total'    => $sousTotal,
                ]);
            }

            $commande = Commande::create([
                'client_id'       => $client->id,
                'restaurant_id'   => $restaurant->id,
                'montant_total'   => $montant,
                'statut'          => $statuts[array_rand($statuts)],
                'type_commande'   => fake()->randomElement(['sur_place', 'sur_place', 'a_emporter', 'livraison']),
                'est_synchronise' => true,
                'synced_at'       => $createdAt,
                'created_at'      => $createdAt,
                'updated_at'      => $createdAt,
            ]);

            $commande->ligneCommandes()->saveMany($lignes);

            $pointsGagnes = (int) ($montant / 1000);
            $soldeAvant   = $client->points_fidelite;
            if ($pointsGagnes > 0) {
                TransactionFidelite::create([
                    'client_id'   => $client->id,
                    'commande_id' => $commande->id,
                    'type'        => 'gain',
                    'points'      => $pointsGagnes,
                    'solde_avant' => $soldeAvant,
                    'solde_apres' => $soldeAvant + $pointsGagnes,
                    'description' => "Gain de {$pointsGagnes} points — Commande #{$commande->id}",
                    'created_at'  => $createdAt,
                    'updated_at'  => $createdAt,
                ]);
                $client->increment('points_fidelite', $pointsGagnes);
            }

            if (fake()->boolean(60)) {
                AvisClient::create([
                    'client_id'     => $client->id,
                    'commande_id'   => $commande->id,
                    'restaurant_id' => $restaurant->id,
                    'note'          => fake()->numberBetween(3, 5),
                    'commentaire'   => fake()->optional(0.7)->sentence(),
                    'created_at'    => $createdAt,
                    'updated_at'    => $createdAt,
                ]);
            }
        }

        // ── Recalcul des points réels ──
        foreach ($clients as $client) {
            $totalGains = (int) TransactionFidelite::where('client_id', $client->id)
                ->where('type', 'gain')
                ->sum('points');
            $client->update(['points_fidelite' => $totalGains]);
        }
    }
}
