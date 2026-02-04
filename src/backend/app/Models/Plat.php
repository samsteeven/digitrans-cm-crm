<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Plat extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['categorie_id', 'nom', 'description', 'prix_unitaire', 'devise', 'disponible', 'image_url'];

    protected $casts = [
        'prix_unitaire' => 'decimal:2',
        'disponible' => 'boolean',
    ];

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(CategoriePlat::class, 'categorie_id');
    }
}
