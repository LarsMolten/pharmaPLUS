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
        Schema::create('vente_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vente_id')->constrained('ventes')->cascadeOnDelete();
            $table->integer('article_id')->nullable();
            $table->integer('entree_detail_id')->nullable();
            $table->integer('consultation_id')->nullable();
            $table->integer('service_id')->nullable();
            $table->string('analyse_id')->nullable();
            $table->integer('kit_id')->nullable();
            $table->decimal('prix_unitaire', 12, 2);
            $table->integer('qte');
            $table->decimal('montant', 12, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vente_details');
    }
};
