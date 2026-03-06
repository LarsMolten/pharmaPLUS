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
        Schema::create('entree_indices', function (Blueprint $table) {
            $table->id();
            $table->string('ref_entree')->unique();
            $table->text('motif')->nullable();
            $table->integer('nb_article')->default(0);
            $table->boolean('etat')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entree_indices');
    }
};
