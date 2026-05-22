<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Authentification des utilisateurs.
 *
 * Gère la connexion (génération de token Sanctum) et la déconnexion (révocation du token).
 * Les identifiants sont validés via email / mot de passe.
 */
class AuthController extends Controller
{
    /**
     * Connecte un utilisateur et génère un token d'accès.
     *
     * Valide les identifiants fournis, puis crée un token Sanctum associé
     * à l'utilisateur. Lève une exception de validation si les identifiants
     * sont incorrects.
     *
     * @param Request $request La requête entrante contenant email, password et optionnellement device_name.
     * @return JsonResponse Les informations de l'utilisateur et le token d'accès.
     * @throws ValidationException Si les identifiants sont invalides.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'device_name' => 'nullable|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants invalides.'],
            ]);
        }

        $token = $user->createToken($validated['device_name'] ?? 'api-token')->plainTextToken;

        return response()->json([
            'user' => $user->only('id', 'name', 'email'),
            'token' => $token,
        ]);
    }

    /**
     * Déconnecte l'utilisateur courant.
     *
     * Révoque le token d'accès actuel de l'utilisateur authentifié.
     *
     * @param Request $request La requête entrante (utilisateur authentifié via Sanctum).
     * @return JsonResponse Un message de confirmation de déconnexion.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
