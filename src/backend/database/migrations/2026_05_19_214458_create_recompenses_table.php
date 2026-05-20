<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recompenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom', 100);
            $table->text('description')->nullable();
            $table->integer('points_requis');
            $table->string('type', 20)->default('produit_offert');
            $table->decimal('valeur', 10, 2)->nullable();
            $table->integer('stock')->default(999);
            $table->boolean('est_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recompenses');
    }
};
