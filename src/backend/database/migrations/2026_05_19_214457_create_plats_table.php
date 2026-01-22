<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('categorie_id')->constrained('categories_plats')->cascadeOnDelete();
            $table->string('nom', 100);
            $table->text('description')->nullable();
            $table->decimal('prix_unitaire', 10, 2);
            $table->string('devise', 5)->default('FCFA');
            $table->boolean('disponible')->default(true);
            $table->text('image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plats');
    }
};
