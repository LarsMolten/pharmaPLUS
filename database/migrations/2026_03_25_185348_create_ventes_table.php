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
        Schema::create('ventes', function (Blueprint $table) {
            $table->id();
            $table->string('reference_vente')->unique();
            $table->integer('user_id');
            $table->decimal('montant_brut', 12, 2);
            $table->decimal('montant_proposee', 12, 2);
            $table->decimal('montant_ecart', 12, 2);
            $table->decimal('montant_paye', 12, 2);
            $table->decimal('monnaie', 12, 2);
            $table->string('mode_paiement');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventes');
    }
};
