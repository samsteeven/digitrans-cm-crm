<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AuditLogController;
use App\Http\Controllers\Api\V1\AvisController;
use App\Http\Controllers\Api\V1\CategorieController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\CommandeController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\EchangeRecompenseController;
use App\Http\Controllers\Api\V1\FideliteController;
use App\Http\Controllers\Api\V1\LigneCommandeController;
use App\Http\Controllers\Api\V1\PalierFideliteController;
use App\Http\Controllers\Api\V1\PermissionController;
use App\Http\Controllers\Api\V1\PlatController;
use App\Http\Controllers\Api\V1\RecompenseController;
use App\Http\Controllers\Api\V1\RestaurantController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\SyncController;
use App\Http\Controllers\Api\V1\SyncLogController;
use App\Http\Controllers\Api\V1\TransactionFideliteController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ─── Authentification ──────────────────────────────────────────────
    // Connexion et déconnexion des utilisateurs (tokens Sanctum)
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login')->name('login');
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {

    // ─── Clients ───────────────────────────────────────────────────────
    // Gestion des clients (CRUD + statistiques)
    Route::get('/clients/statistiques', [ClientController::class, 'statistiques']);
    Route::apiResource('clients', ClientController::class);

    // ─── Commandes ─────────────────────────────────────────────────────
    // Commandes et lignes de commande
    Route::patch('/commandes/{commande}/statut', [CommandeController::class, 'updateStatut']);
    Route::apiResource('commandes', CommandeController::class);

    // ─── Plats & Catégories ─────────────────────────────────────────────
    // Gestion du menu (plats et catégories)
    Route::apiResource('plats', PlatController::class);
    Route::apiResource('categories', CategorieController::class);

    // ─── Fidélité ───────────────────────────────────────────────────────
    // Points, paliers, récompenses, transactions et échanges
    Route::get('/fidelite/clients/{client}/points', [FideliteController::class, 'points']);
    Route::post('/fidelite/points/ajouter', [FideliteController::class, 'ajouterPoints']);
    Route::get('/fidelite/recompenses', [FideliteController::class, 'recompenses']);
    Route::post('/fidelite/echanger', [FideliteController::class, 'echangerPoints']);

    // ─── Avis ──────────────────────────────────────────────────────────
    // Avis clients (CRUD + analyse)
    Route::get('/avis/analyse', [AvisController::class, 'analyse']);
    Route::apiResource('avis', AvisController::class);

    // ─── Dashboard ──────────────────────────────────────────────────────
    // Indicateurs KPI, évolutions et classements
    Route::get('/dashboard/kpi', [DashboardController::class, 'kpi']);
    Route::get('/dashboard/evolution', [DashboardController::class, 'evolution']);
    Route::get('/dashboard/restaurants', [DashboardController::class, 'restaurants']);
    Route::get('/dashboard/top-clients', [DashboardController::class, 'topClients']);

    // ─── Restaurants ────────────────────────────────────────────────────
    // Gestion des restaurants (CRUD)
    Route::apiResource('restaurants', RestaurantController::class);

    // Lignes de commande (détail des commandes)
    Route::apiResource('ligne-commandes', LigneCommandeController::class);

    // Paliers de fidélité (niveaux et seuils de points)
    Route::apiResource('paliers-fidelite', PalierFideliteController::class);

    // Transactions de fidélité (historique des points, lecture seule)
    Route::get('/transactions-fidelite', [TransactionFideliteController::class, 'index']);
    Route::get('/transactions-fidelite/{transactionFidelite}', [TransactionFideliteController::class, 'show']);

    // Récompenses (catalogue de récompenses)
    Route::apiResource('recompenses', RecompenseController::class);

    // Échanges de récompenses (historique des échanges clients)
    Route::apiResource('echanges-recompenses', EchangeRecompenseController::class)->except(['store']);

    // ─── Audit & Sync Logs ─────────────────────────────────────────
    // Historique des actions et synchronisations (lecture seule)
    Route::get('/audit-logs', [AuditLogController::class, 'index']);
    Route::get('/audit-logs/{auditLog}', [AuditLogController::class, 'show']);
    Route::get('/sync-logs', [SyncLogController::class, 'index']);
    Route::get('/sync-logs/{syncLog}', [SyncLogController::class, 'show']);

    // ─── Utilisateurs, Rôles & Permissions ──────────────────────────────
    // Gestion des utilisateurs, rôles et permissions
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);

    // ─── Synchronisation ────────────────────────────────────────────
    // Synchronisation offline-first (push / pending)
    Route::post('/sync', [SyncController::class, 'synchroniser']);
    Route::get('/sync/pending', [SyncController::class, 'pending']);
    });
});

// ─── Documentation, Santé & Métriques ────────────────────────────────
// Documentation Swagger, health check et métriques Prometheus

// Endpoint public (santé)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'module' => 'CRM SavoirManger',
        'version' => '1.0.0',
        'timestamp' => now(),
    ]);
});

// Metriques Prometheus
Route::get('/metrics', function () {
    $clients = \App\Models\Client::count();
    $commandes = \App\Models\Commande::count();
    $ca = \App\Models\Commande::sum('montant_total');
    $avis = \App\Models\AvisClient::count();

    $metrics = "# HELP crm_clients_total Nombre total de clients\n";
    $metrics .= "# TYPE crm_clients_total gauge\n";
    $metrics .= "crm_clients_total {$clients}\n\n";
    $metrics .= "# HELP crm_commandes_total Nombre total de commandes\n";
    $metrics .= "# TYPE crm_commandes_total gauge\n";
    $metrics .= "crm_commandes_total {$commandes}\n\n";
    $metrics .= "# HELP crm_ca_total Chiffre d'affaires total (FCFA)\n";
    $metrics .= "# TYPE crm_ca_total gauge\n";
    $metrics .= "crm_ca_total {$ca}\n\n";
    $metrics .= "# HELP crm_avis_total Nombre total d'avis\n";
    $metrics .= "# TYPE crm_avis_total gauge\n";
    $metrics .= "crm_avis_total {$avis}\n\n";

    return response($metrics, 200)->header('Content-Type', 'text/plain; version=0.0.4');
});

// Documentation Swagger UI
Route::get('/docs', function () {
    return <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>CRM SavoirManger - Documentation API</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
    <style>
        html { box-sizing: border-box; overflow-y: scroll; }
        body { margin: 0; background: #f8f9fa; }
        .topbar-wrapper img { display: none; }
        .topbar-wrapper a:after { content: "CRM SavoirManger - API DIGITRANS-CM"; font-weight: bold; font-size: 1.2em; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: '/api/docs.yaml',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
            layout: "BaseLayout"
        });
    </script>
</body>
</html>
HTML;
});

Route::get('/docs.yaml', function () {
    $path = public_path('openapi.yaml');
    if (!file_exists($path)) {
        return response()->json(['error' => 'Documentation non disponible'], 404);
    }
    return response()->file($path, ['Content-Type' => 'text/yaml; charset=utf-8']);
});
