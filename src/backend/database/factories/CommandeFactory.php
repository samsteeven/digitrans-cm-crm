<?php

namespace Database\Factories;

use App\Models\Commande;
use App\Models\Client;
use App\Models\Restaurant;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommandeFactory extends Factory
{
    protected $model = Commande::class;

    public function definition(): array
    {
        // Date échelonnée sur les 5 derniers mois (janvier - mai 2026)
        $createdAt = Carbon::now()->subDays(rand(1, 150));

        return [
            'client_id' => Client::factory(),
            'restaurant_id' => Restaurant::factory(),
            'montant_total' => fake()->numberBetween(2500, 75000),
            'statut' => fake()->randomElement(['en_attente', 'confirmee', 'en_preparation', 'prete', 'livree']),
            'type_commande' => fake()->randomElement(['sur_place', 'a_emporter', 'livraison']),
            'est_synchronise' => true,
            'synced_at' => $createdAt,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }

    /**
     * Indique que la commande a été créée hors-ligne.
     */
    public function offline(): static
    {
        return $this->state(fn (array $attributes) => [
            'est_synchronise' => false,
            'synced_at' => null,
        ]);
    }

    /**
     * Définit une date précise pour la commande.
     */
    public function createdAt(Carbon $date): static
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => $date,
            'updated_at' => $date,
            'synced_at' => $date,
        ]);
    }

    /**
     * Définit un statut précis.
     */
    public function statut(string $statut): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => $statut,
        ]);
    }

    /**
     * Définit un client spécifique.
     */
    public function forClient(Client $client): static
    {
        return $this->state(fn (array $attributes) => [
            'client_id' => $client->id,
        ]);
    }

    /**
     * Définit un restaurant spécifique.
     */
    public function atRestaurant(Restaurant $restaurant): static
    {
        return $this->state(fn (array $attributes) => [
            'restaurant_id' => $restaurant->id,
        ]);
    }
}
