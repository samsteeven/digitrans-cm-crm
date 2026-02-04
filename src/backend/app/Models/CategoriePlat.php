<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriePlat extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['nom', 'description'];

    protected $table = 'categories_plats';

    public function plats(): HasMany
    {
        return $this->hasMany(Plat::class, 'categorie_id');
    }
}
