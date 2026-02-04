<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
