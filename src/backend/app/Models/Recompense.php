<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * Récompense disponible dans le programme de fidélité.
 *
 * @property string $id UUID
 * @property string $nom Nom de la récompense
 * @property string|null $description Description détaillée
 * @property int $points_requis Points nécessaires pour obtenir la récompense
 * @property string $type Type de récompense (menu, remise, produit)
 * @property float|null $valeur Valeur monétaire en FCFA
 * @property int $stock Stock disponible (épuisable)
 * @property bool $est_active La récompense est disponible
 */
class Recompense extends Model
{
    use HasUuids;

    protected $fillable = ['nom', 'description', 'points_requis', 'type', 'valeur', 'stock', 'est_active'];

    protected $casts = [
        'valeur' => 'decimal:2',
        'stock' => 'integer',
        'est_active' => 'boolean',
    ];
}
