<?php

namespace App\Models;

use Database\Factories\RestaurantFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Restaurant de la chaîne SavoirManger.
 *
 * @property string $id UUID
 * @property string $nom Nom du restaurant
 * @property string $ville Ville d'implantation
 * @property string $quartier Quartier
 * @property string|null $adresse Adresse complète
 * @property string|null $telephone Numéro de contact
 * @property string|null $email Email de contact
 * @property bool $est_actif Le restaurant est actif
 * @property int|null $capacite Capacité d'accueil (couverts)
 * @property-read Collection<int, Commande> $commandes
 * @property-read Collection<int, AvisClient> $avis
 */
class Restaurant extends Model
{
    /** @use HasFactory<RestaurantFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'nom', 'ville', 'quartier', 'adresse',
        'telephone', 'email', 'est_actif', 'capacite',
    ];

    protected $casts = [
        'est_actif' => 'boolean',
        'capacite' => 'integer',
    ];

    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class);
    }

    public function avis(): HasMany
    {
        return $this->hasMany(AvisClient::class);
    }
}
