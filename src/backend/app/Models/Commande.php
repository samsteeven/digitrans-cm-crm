<?php

namespace App\Models;

use Database\Factories\CommandeFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Commande passée par un client dans un restaurant.
 *
 * @property string $id UUID
 * @property string $client_id Référence vers le client
 * @property string $restaurant_id Référence vers le restaurant
 * @property string $statut Statut (en_attente, confirmee, en_preparation, prete, livree)
 * @property float $montant_total Montant total en FCFA
 * @property string $devise Devise (par défaut XAF)
 * @property string $type_commande Type (sur_place, a_emporter, livraison)
 * @property string|null $notes Notes supplémentaires
 * @property bool $est_synchronise Synchronisé avec le serveur
 * @property string|null $synced_at Date de synchronisation
 * @property-read Client $client
 * @property-read Restaurant $restaurant
 * @property-read Collection<int, LigneCommande> $ligneCommandes
 * @property-read AvisClient|null $avis
 */
class Commande extends Model
{
    /** @use HasFactory<CommandeFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'client_id', 'restaurant_id', 'statut', 'montant_total',
        'devise', 'type_commande', 'notes',
        'est_synchronise', 'synced_at',
    ];

    protected $casts = [
        'montant_total' => 'decimal:2',
        'est_synchronise' => 'boolean',
        'synced_at' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function ligneCommandes(): HasMany
    {
        return $this->hasMany(LigneCommande::class);
    }

    public function avis(): HasOne
    {
        return $this->hasOne(AvisClient::class);
    }
}
