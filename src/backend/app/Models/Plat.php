<?php

namespace App\Models;

use Database\Factories\PlatFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Plat proposé dans la carte d'un restaurant SavoirManger.
 *
 * @property string $id UUID
 * @property string $categorie_id Référence vers la catégorie
 * @property string $nom Nom du plat
 * @property string|null $description Description détaillée
 * @property float $prix_unitaire Prix unitaire en FCFA
 * @property string $devise Devise (par défaut XAF)
 * @property bool $disponible Disponible à la commande
 * @property string|null $image_url URL de l'image du plat
 * @property-read CategoriePlat $categorie
 */
class Plat extends Model
{
    /** @use HasFactory<PlatFactory> */
    use HasFactory, HasUuids;

    protected $fillable = ['categorie_id', 'nom', 'description', 'prix_unitaire', 'devise', 'disponible', 'image_url'];

    protected $casts = [
        'prix_unitaire' => 'decimal:2',
        'disponible' => 'boolean',
    ];

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(CategoriePlat::class, 'categorie_id');
    }
}
