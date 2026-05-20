<?php

namespace App\Models;

use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Client d'un restaurant SavoirManger.
 *
 * @property string $id UUID
 * @property string $nom Nom de famille
 * @property string $prenom Prénom
 * @property string $email Adresse email unique
 * @property string|null $telephone Numéro de téléphone
 * @property string|null $date_naissance Date de naissance
 * @property bool $est_fidelite Adhère au programme fidélité
 * @property int $points_fidelite Points de fidélité cumulés
 * @property string $segment Segment client (standard, premium, vip)
 * @property array|null $preferences Préférences culinaires (JSON)
 * @property string|null $notes Notes internes
 * @property-read string $nom_complet Prénom + Nom (accesseur)
 * @property-read Collection<int, Commande> $commandes
 * @property-read Collection<int, TransactionFidelite> $transactionsFidelite
 * @property-read Collection<int, AvisClient> $avis
 */
class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
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
