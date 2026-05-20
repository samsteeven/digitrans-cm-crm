<?php

namespace App\Models;

use Database\Factories\CategoriePlatFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Catégorie de plats (Entrées, Plats principaux, Desserts, Boissons).
 *
 * @property string $id UUID
 * @property string $nom Nom de la catégorie
 * @property string|null $description Description
 * @property-read Collection<int, Plat> $plats
 */
class CategoriePlat extends Model
{
    /** @use HasFactory<CategoriePlatFactory> */
    use HasFactory, HasUuids;

    protected $fillable = ['nom', 'description'];

    protected $table = 'categories_plats';

    public function plats(): HasMany
    {
        return $this->hasMany(Plat::class, 'categorie_id');
    }
}
