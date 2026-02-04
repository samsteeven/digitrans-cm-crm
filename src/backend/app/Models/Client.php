<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'nom', 'prenom', 'email', 'telephone', 'date_naissance',
        'est_fidelite', 'points_fidelite', 'segment',
        'preferences', 'notes',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'est_fidelite' => 'boolean',
        'points_fidelite' => 'integer',
        'preferences' => 'array',
    ];

    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class);
    }

    public function transactionsFidelite(): HasMany
    {
        return $this->hasMany(TransactionFidelite::class);
    }

    public function avis(): HasMany
    {
        return $this->hasMany(AvisClient::class);
    }

    public function getNomCompletAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }
}
