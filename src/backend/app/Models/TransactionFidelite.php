<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TransactionFidelite extends Model
{
    use HasUuids;

    protected $fillable = ['client_id', 'commande_id', 'type', 'points', 'solde_avant', 'solde_apres', 'description'];

    protected $casts = ['points' => 'integer', 'solde_avant' => 'integer', 'solde_apres' => 'integer'];

    protected $table = 'transactions_fidelite';
}
