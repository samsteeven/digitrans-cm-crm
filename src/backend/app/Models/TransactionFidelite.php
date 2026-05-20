<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * Transaction du programme de fidélité (gain ou échange de points).
 *
 * @property string $id UUID
 * @property string $client_id Référence vers le client
 * @property string|null $commande_id Référence vers la commande associée
 * @property string $type Type (gain, echange)
 * @property int $points Points gagnés (positif) ou échangés (négatif)
 * @property int $solde_avant Solde avant la transaction
 * @property int $solde_apres Solde après la transaction
 * @property string|null $description Description de la transaction
 */
class TransactionFidelite extends Model
{
    use HasUuids;

    protected $fillable = ['client_id', 'commande_id', 'type', 'points', 'solde_avant', 'solde_apres', 'description'];

    protected $casts = ['points' => 'integer', 'solde_avant' => 'integer', 'solde_apres' => 'integer'];

    protected $table = 'transactions_fidelite';
}
