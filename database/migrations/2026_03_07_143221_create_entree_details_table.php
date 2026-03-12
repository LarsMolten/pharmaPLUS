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
        Schema::create('entree_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entree_indices_id')->constrained('entree_indices')->cascadeOnDelete();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->string('lot');
            $table->integer('qte_initial')->default(0);
            $table->integer('qte_entree')->default(0);
            $table->integer('stock_restant_lot')->default(0);
            $table->integer('stock_dispo')->default(0);
            $table->decimal('prix_achat_boite', 12,2);
            $table->decimal('prix_unitaire', 12,2);
            $table->decimal('montant_entree', 12,2);
            $table->integer('nb_lot_dispo')->default(0);
            $table->date('date_peremption');
            $table->boolean('isValide')->default(false);
            $table->boolean('isVendus')->default(false);
            $table->boolean('etat')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entree_details');
    }
};
