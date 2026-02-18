<?php

namespace Database\Factories;

use App\Models\Plat;
use App\Models\CategoriePlat;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlatFactory extends Factory
{
    protected $model = Plat::class;

    public function definition(): array
    {
        return [
            'categorie_id' => CategoriePlat::factory(),
            'nom' => fake()->word(),
            'prix_unitaire' => fake()->numberBetween(1000, 10000),
            'disponible' => true,
        ];
    }
}
