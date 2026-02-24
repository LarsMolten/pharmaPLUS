<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('unites', function (Blueprint $table) {
            $table->id();
            $table->string('nomUnite')->unique();
            $table->string('nomComplet');
            $table->boolean('supun')->default(false);
            $table->timestamps();
        });

        // Insérer des valeurs initiales pour la table `unites`
        DB::table('unites')->insert([
            ['nomUnite' => 'BT', 'nomComplet' => 'Boîte', 'supun' => false, 'created_at' => now(), 'updated_at' => now()],
            ['nomUnite' => 'Flacon',  'nomComplet' => 'Flacon',  'supun' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nomUnite' => 'Tube',  'nomComplet' => 'Tube',  'supun' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nomUnite' => 'Unité', 'nomComplet' => 'Unité',  'supun' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unites');
    }
};
