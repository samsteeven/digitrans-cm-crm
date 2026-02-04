<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Recompense extends Model
{
    use HasUuids;

    protected $fillable = ['nom', 'description', 'points_requis', 'type', 'valeur', 'stock', 'est_active'];

    protected $casts = [
        'valeur' => 'decimal:2',
        'stock' => 'integer',
        'est_active' => 'boolean',
    ];
}
