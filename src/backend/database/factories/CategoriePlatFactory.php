<?php

namespace Database\Factories;

use App\Models\CategoriePlat;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoriePlatFactory extends Factory
{
    protected $model = CategoriePlat::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->word(),
        ];
    }
}
