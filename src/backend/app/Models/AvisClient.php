<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Avis et notation laissés par un client après une commande.
 *
 * @property string $id UUID
 * @property string $client_id Référence vers le client
 * @property string $commande_id Référence vers la commande
 * @property string $restaurant_id Référence vers le restaurant
 * @property int $note Note sur 5
 * @property string|null $commentaire Commentaire textuel
 * @property bool $est_modere Avis modéré par un administrateur
 * @property-read Client $client
 * @property-read Commande $commande
 * @property-read Restaurant $restaurant
 */
class AvisClient extends Model
{
    /** @use HasFactory<\Database\Factories\AvisClientFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'client_id', 'commande_id', 'restaurant_id',
        'note', 'commentaire', 'est_modere',
    ];

    protected $casts = [
        'note' => 'integer',
        'est_modere' => 'boolean',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }
}
