<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * Palier du programme de fidélité (Bronze, Argent, Or, Platine).
 *
 * @property string $id UUID
 * @property string $nom Nom du palier
 * @property int $points_minimum Points minimum requis
 * @property int|null $points_maximum Points maximum (null = infini)
 * @property string|null $description Avantages du palier
 */
class PalierFidelite extends Model
{
    use HasUuids;

    protected $fillable = ['nom', 'points_minimum', 'points_maximum', 'description'];
}
