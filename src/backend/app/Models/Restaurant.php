<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
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
