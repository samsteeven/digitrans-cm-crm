<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * Échange de points contre une récompense par un client.
 *
 * @property string $id UUID
 * @property string $client_id Référence vers le client
 * @property string $recompense_id Référence vers la récompense
 * @property int $points_utilises Points dépensés
 * @property string $statut Statut (utilisé, en_attente, expiré)
 * @property string $code_utilisation Code unique de la récompense
 * @property string|null $expire_le Date d'expiration du code
 */
class EchangeRecompense extends Model
{
    use HasUuids;

    protected $fillable = ['client_id', 'recompense_id', 'points_utilises', 'statut', 'code_utilisation', 'expire_le'];

    protected $casts = ['expire_le' => 'date'];

    protected $table = 'echanges_recompenses';
}
