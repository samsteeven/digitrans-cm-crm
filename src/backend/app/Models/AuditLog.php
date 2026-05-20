<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * Journal d'audit pour tracer les modifications importantes.
 *
 * @property string $id UUID
 * @property string|null $utilisateur_id Référence vers l'utilisateur
 * @property string $action Action effectuée (create, update, delete)
 * @property string $entite_type Type d'entité modifiée
 * @property string|null $entite_id ID de l'entité modifiée
 * @property array|null $anciennes_valeurs Valeurs avant modification
 * @property array|null $nouvelles_valeurs Valeurs après modification
 * @property string|null $adresse_ip Adresse IP de l'auteur
 * @property string|null $user_agent User-Agent de la requête
 */
class AuditLog extends Model
{
    use HasUuids;

    protected $fillable = ['utilisateur_id', 'action', 'entite_type', 'entite_id', 'anciennes_valeurs', 'nouvelles_valeurs', 'adresse_ip', 'user_agent'];

    protected $casts = ['anciennes_valeurs' => 'array', 'nouvelles_valeurs' => 'array'];
}
