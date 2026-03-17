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
        Schema::create('detail_ventes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->string('analyse_id');
            $table->foreignId('service')->constrained('services')->cascadeOnDelete();
            $table->foreignId('kit_id')->constrained('kits')->cascadeOnDelete();
            $table->decimal('prix_unitaire', 12, 2);
            $table->integer('quantite')->default(0);
            $table->decimal('montant', 12, 2)->default(0);
            $table->boolean('isPayed')->default(false);
            $table->boolean('etat')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_ventes');
    }
};
