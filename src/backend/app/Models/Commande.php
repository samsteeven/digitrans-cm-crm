<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commande extends Model
{
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

    public function avis()
    {
        return $this->hasOne(AvisClient::class);
    }
}
