<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avis_clients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('commande_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('restaurant_id')->constrained()->cascadeOnDelete();
            $table->integer('note');
            $table->text('commentaire')->nullable();
            $table->boolean('est_modere')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis_clients');
    }
};
