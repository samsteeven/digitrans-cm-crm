<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sync_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('entite_type', 50);
            $table->uuid('entite_id');
            $table->string('action', 10);
            $table->json('payload');
            $table->boolean('est_synchronise')->default(false);
            $table->timestamps();
            $table->timestamp('synced_at')->nullable();

            $table->index(['est_synchronise']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sync_logs');
    }
};
