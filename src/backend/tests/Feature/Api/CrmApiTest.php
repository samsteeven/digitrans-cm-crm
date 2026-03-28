<?php

namespace Tests\Feature\Api;

use App\Models\Client;
use App\Models\Commande;
use App\Models\Plat;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrmApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_lists_clients(): void
    {
        Client::factory(3)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/v1/clients');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_creates_client(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/clients', [
                'nom' => 'Moukam',
                'prenom' => 'Henri',
                'email' => 'hc@agrocam.cm',
            ]);

        $response->assertStatus(201);
    }

    public function test_rejects_duplicate_email(): void
    {
        Client::factory()->create(['email' => 'dup@test.cm']);

        $this->actingAs($this->user)
            ->postJson('/api/v1/clients', [
                'nom' => 'Test', 'prenom' => 'T', 'email' => 'dup@test.cm',
            ])->assertStatus(422);
    }

    public function test_creates_commande_with_lignes(): void
    {
        $client = Client::factory()->create();
        $restaurant = Restaurant::factory()->create();
        $plat = Plat::factory()->create(['prix_unitaire' => 5000]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/commandes', [
                'client_id' => $client->id,
                'restaurant_id' => $restaurant->id,
                'type_commande' => 'sur_place',
                'lignes' => [['plat_id' => $plat->id, 'quantite' => 2]],
            ]);

        $response->assertStatus(201);
    }

    public function test_updates_commande_statut(): void
    {
        $commande = Commande::factory()->create(['statut' => 'en_attente']);

        $this->actingAs($this->user)
            ->patchJson("/api/v1/commandes/{$commande->id}/statut", ['statut' => 'confirmee'])
            ->assertStatus(200);

        $this->assertEquals('confirmee', $commande->fresh()->statut);
    }

    public function test_returns_dashboard_kpi(): void
    {
        $this->actingAs($this->user)
            ->getJson('/api/v1/dashboard/kpi')
            ->assertStatus(200)
            ->assertJsonStructure(['chiffre_affaires', 'total_commandes']);
    }

    public function test_rejects_unauthenticated(): void
    {
        $this->getJson('/api/v1/clients')->assertStatus(401);
    }

    public function test_health_endpoint(): void
    {
        $this->getJson('/api/health')
            ->assertStatus(200)
            ->assertJsonFragment(['module' => 'CRM SavoirManger']);
    }
}
