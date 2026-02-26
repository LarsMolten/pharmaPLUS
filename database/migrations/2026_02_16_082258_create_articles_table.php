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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('designation');
            $table->integer('presentation');
            $table->foreignId('unite')->constrained('unites')->cascadeOnDelete();
            $table->integer('stock')->default(0);
            $table->enum('statut', ['disponible', 'indisponible'])->default('disponible');
            $table->boolean('etat')->default(true); // true = actif, false = supprimé
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
