<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class EchangeRecompense extends Model
{
    use HasUuids;

    protected $fillable = ['client_id', 'recompense_id', 'points_utilises', 'statut', 'code_utilisation', 'expire_le'];

    protected $casts = ['expire_le' => 'date'];

    protected $table = 'echanges_recompenses';
}
