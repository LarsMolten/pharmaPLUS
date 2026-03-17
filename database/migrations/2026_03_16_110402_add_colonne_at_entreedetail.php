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
        Schema::table('entree_details', function (Blueprint $table) {
        $table->decimal('pu_proposee', 12,2)->default(0)->after('prix_unitaire');
        $table->decimal('montant_gain_brut', 12, 2)->default(0)->after('montant_entree');
        $table->decimal('montant_gain_proposee', 12, 2)->default(0)->after('montant_gain_brut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
