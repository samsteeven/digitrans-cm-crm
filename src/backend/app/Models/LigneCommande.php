<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Ligne de commande (article individuel dans une commande).
 *
 * @property string $id UUID
 * @property string $commande_id Référence vers la commande
 * @property string $plat_id Référence vers le plat
 * @property int $quantite Quantité commandée
 * @property float $prix_unitaire Prix unitaire au moment de la commande
 * @property float $sous_total Quantité × prix unitaire
 * @property string|null $notes Instructions spéciales
 * @property-read Commande $commande
 * @property-read Plat $plat
 */
class LigneCommande extends Model
{
    use HasUuids;

    protected $fillable = ['commande_id', 'plat_id', 'quantite', 'prix_unitaire', 'sous_total', 'notes'];

    protected $casts = [
        'quantite' => 'integer',
        'prix_unitaire' => 'decimal:2',
        'sous_total' => 'decimal:2',
    ];

    protected $table = 'ligne_commandes';

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function plat(): BelongsTo
    {
        return $this->belongsTo(Plat::class);
    }
}
