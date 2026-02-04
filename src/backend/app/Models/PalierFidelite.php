<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PalierFidelite extends Model
{
    use HasUuids;

    protected $fillable = ['nom', 'points_minimum', 'points_maximum', 'description'];
}
