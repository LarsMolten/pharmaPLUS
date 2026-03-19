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
        Schema::create('paniers', function (Blueprint $table) {
            $table->id();
            $table->integer('entree_detail_id')->nullable();
            $table->integer('article_id')->nullable();
            $table->string('analyse_id')->nullable();
            $table->foreignId('service_id')->nullable();
            $table->foreignId('kit_id')->nullable();
            $table->decimal('p_u_brut', 12, 2);
            $table->decimal('p_u_proposee', 12, 2);
            $table->integer('qte')->default(0);
            $table->decimal('montant_brut', 12, 4);
            $table->decimal('montant_proposee', 12, 4);
            $table->decimal('montant_ecart', 12, 4);
            $table->integer('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paniers');
    }
};
