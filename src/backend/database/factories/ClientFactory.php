<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        $segment = fake()->randomElement(['standard', 'premium', 'vip']);
        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => '6' . fake()->numerify('########'),
            'segment' => $segment,
            'est_fidelite' => $segment !== 'standard',
            'points_fidelite' => fake()->numberBetween(0, 5000),
        ];
    }
}
