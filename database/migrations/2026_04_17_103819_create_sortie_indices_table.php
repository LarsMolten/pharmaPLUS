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
        Schema::create('sortie_indices', function (Blueprint $table) {
            $table->id();
            $table->string('ref_sortie')->unique();
            $table->string('motif');
            $table->integer('nb_article')->default(0);
            $table->decimal('montant_total', 12, 2)->default(0);
            $table->boolean('etat')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sortie_indices');
    }
};
