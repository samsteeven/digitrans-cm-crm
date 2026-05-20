<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AvisController;
use App\Http\Controllers\Api\V1\CategorieController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\CommandeController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\FideliteController;
use App\Http\Controllers\Api\V1\PlatController;
use App\Http\Controllers\Api\V1\SyncController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'throttle:api'])->prefix('v1')->group(function () {

    // Clients
    Route::get('/clients/statistiques', [ClientController::class, 'statistiques']);
    Route::apiResource('clients', ClientController::class);

    // Commandes
    Route::patch('/commandes/{commande}/statut', [CommandeController::class, 'updateStatut']);
    Route::apiResource('commandes', CommandeController::class);

    // Plats
    Route::apiResource('plats', PlatController::class);
    Route::apiResource('categories', CategorieController::class);

    // Fidélité
    Route::get('/fidelite/clients/{client}/points', [FideliteController::class, 'points']);
    Route::post('/fidelite/points/ajouter', [FideliteController::class, 'ajouterPoints']);
    Route::get('/fidelite/recompenses', [FideliteController::class, 'recompenses']);
    Route::post('/fidelite/echanger', [FideliteController::class, 'echangerPoints']);

    // Avis
    Route::get('/avis/analyse', [AvisController::class, 'analyse']);
    Route::apiResource('avis', AvisController::class);

    // Dashboard
    Route::get('/dashboard/kpi', [DashboardController::class, 'kpi']);
    Route::get('/dashboard/evolution', [DashboardController::class, 'evolution']);
    Route::get('/dashboard/restaurants', [DashboardController::class, 'restaurants']);
    Route::get('/dashboard/top-clients', [DashboardController::class, 'topClients']);

    // Synchronisation offline-first
    Route::post('/sync', [SyncController::class, 'synchroniser']);
    Route::get('/sync/pending', [SyncController::class, 'pending']);
});

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
