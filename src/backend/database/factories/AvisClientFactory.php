<?php

namespace Database\Factories;

use App\Models\AvisClient;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AvisClient>
 */
class AvisClientFactory extends Factory
{
    protected $model = AvisClient::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Utilisation de Factories existantes pour générer automatiquement les entités liées
            'client_id'     => Client::factory(),
            'commande_id'   => Commande::factory(),
            'restaurant_id' => Restaurant::factory(),
            'note'          => $this->faker->numberBetween(1, 5),
            'commentaire'   => $this->faker->optional(0.8)->realText(200), // 80% de chance d'avoir un commentaire
            'est_modere'    => $this->faker->boolean(15), // 15% de chance d'être modéré par défaut
        ];
    }

    /**
     * État spécifique pour un avis déjà modéré.
     */
    public function modere(): AvisClientFactory
    {
        return $this->state(function (array $attributes) {
            return [
                'est_modere' => true,
            ];
        });
    }
}
