<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * Journal de synchronisation offline-first.
 *
 * @property string $id UUID
 * @property string $entite_type Type d'entité (commande, avis, client)
 * @property string|null $entite_id ID de l'entité après synchronisation
 * @property string $action Action (create, update)
 * @property array $payload Données brutes de l'entité
 * @property bool $est_synchronise Marqueur de synchronisation
 * @property string|null $synced_at Date de synchronisation
 */
class SyncLog extends Model
{
    use HasUuids;

    protected $fillable = ['entite_type', 'entite_id', 'action', 'payload', 'est_synchronise', 'synced_at'];

    protected $casts = [
        'payload' => 'array',
        'est_synchronise' => 'boolean',
        'synced_at' => 'datetime',
    ];
}
