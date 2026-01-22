<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('echanges_recompenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('recompense_id')->constrained()->cascadeOnDelete();
            $table->integer('points_utilises');
            $table->string('statut', 20)->default('valide');
            $table->string('code_utilisation', 20)->unique();
            $table->date('expire_le')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('echanges_recompenses');
    }
};
