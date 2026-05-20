<?php

namespace Database\Factories;

use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

class RestaurantFactory extends Factory
{
    protected $model = Restaurant::class;

    public function definition(): array
    {
        return [
            'nom' => 'SavoirManger ' . fake()->city(),
            'ville' => fake()->randomElement(['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Ngaoundéré']),
            'quartier' => fake()->word(),
            'telephone' => '6' . fake()->numerify('########'),
            'est_actif' => true,
        ];
    }
}
