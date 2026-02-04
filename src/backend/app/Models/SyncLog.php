<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

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
