<?php

namespace Tests\Feature\Api;

use App\Models\AvisClient;
use App\Models\Commande;
use App\Models\User; // Remplacez par votre modèle authentifiable (ex: Utilisateur/Admin) si différent
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class EndpointsManquantsTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Crée et authentifie un utilisateur via Sanctum pour passer le middleware auth:sanctum
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');
    }

    # Archetype Tests : Commandes

    public function test_can_update_commande(): void
    {
        $commande = Commande::factory()->create([
            'statut' => 'en_attente'
        ]);

        $payload = [
            'statut' => 'en_preparation',
            'notes'  => 'Ajouter des couverts supplémentaires.'
        ];

        $response = $this->patchJson("/api/v1/commandes/{$commande->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.statut', 'en_preparation');

        $this->assertDatabaseHas('commandes', [
            'id' => $commande->id,
            'statut' => 'en_preparation',
            'notes' => 'Ajouter des couverts supplémentaires.'
        ]);
    }

    public function test_can_destroy_commande(): void
    {
        $commande = Commande::factory()->create();

        $response = $this->deleteJson("/api/v1/commandes/{$commande->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('commandes', [
            'id' => $commande->id
        ]);
    }

    # Archetype Tests : Avis Clients

    public function test_can_show_avis_client(): void
    {
        $avis = AvisClient::factory()->create();

        $response = $this->getJson("/api/v1/avis/{$avis->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data' => ['id', 'client_id', 'commande_id', 'restaurant_id', 'note', 'commentaire', 'est_modere']
            ]);
    }

    public function test_can_update_avis_client(): void
    {
        $avis = AvisClient::factory()->create([
            'est_modere' => false
        ]);

        $payload = [
            'note' => 5,
            'est_modere' => true
        ];

        // Attention au binding de la ressource : l'apiResource de 'avis' résout par défaut le paramètre {avi}
        $response = $this->putJson("/api/v1/avis/{$avis->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.est_modere', true)
            ->assertJsonPath('data.note', 5);

        $this->assertDatabaseHas('avis_clients', [
            'id' => $avis->id,
            'note' => 5,
            'est_modere' => true
        ]);
    }

    public function test_can_destroy_avis_client(): void
    {
        $avis = AvisClient::factory()->create();

        $response = $this->deleteJson("/api/v1/avis/{$avis->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('avis_clients', [
            'id' => $avis->id
        ]);
    }
}
