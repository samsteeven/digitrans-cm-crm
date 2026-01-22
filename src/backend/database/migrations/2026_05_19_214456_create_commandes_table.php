<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('restaurant_id')->constrained()->cascadeOnDelete();
            $table->string('statut', 20)->default('en_attente');
            $table->decimal('montant_total', 12, 2);
            $table->string('devise', 5)->default('FCFA');
            $table->string('type_commande', 20)->default('sur_place');
            $table->text('notes')->nullable();
            $table->boolean('est_synchronise')->default(true);
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
