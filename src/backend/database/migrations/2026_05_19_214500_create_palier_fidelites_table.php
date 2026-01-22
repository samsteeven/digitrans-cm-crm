<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('palier_fidelites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom', 50);
            $table->integer('points_minimum');
            $table->integer('points_maximum')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('palier_fidelites');
    }
};
