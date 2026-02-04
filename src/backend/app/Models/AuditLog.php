<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasUuids;

    protected $fillable = ['utilisateur_id', 'action', 'entite_type', 'entite_id', 'anciennes_valeurs', 'nouvelles_valeurs', 'adresse_ip', 'user_agent'];

    protected $casts = ['anciennes_valeurs' => 'array', 'nouvelles_valeurs' => 'array'];
}
