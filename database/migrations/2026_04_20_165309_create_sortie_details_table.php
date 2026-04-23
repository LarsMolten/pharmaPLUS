<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sortie_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_entree_detail')->constrained('entree_details')->cascadeOneDelete();
            $table->foreignId('sortie_indices_id')->constrained('sortie_indices')->cascadeOneDelete();
            $table->integer('qte_initial')->default(0);
            $table->integer('qte_sortie')->default(0);
            $table->integer('stock_restant_lot')->default(0);
            $table->integer('stock_dispo')->default(0);
            $table->decimal('montant_perte', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sortie_details');
    }
};
