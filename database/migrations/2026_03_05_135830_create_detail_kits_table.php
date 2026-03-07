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
        Schema::create('detail_kits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_kit')->constrained('kits')->cascadeOnDelete();
            $table->foreignId('id_article')->constrained('articles')->cascadeOnDelete();
            $table->integer('qte_kit');
            $table->boolean('etat')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_kits');
    }
};
