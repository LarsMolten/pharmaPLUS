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
       
       // INDEX FIFO
        Schema::table('entree_details', function (Blueprint $table) {

            $table->index(
                ['article_id','isValide','stock_restant_lot','date_peremption'],
                'idx_fifo_lot'
            );

        });

        // INDEX panier utilisateur
        Schema::table('paniers', function (Blueprint $table) {

            $table->index('user_id','idx_panier_user');

        });

        // INDEX article dans panier
        Schema::table('paniers', function (Blueprint $table) {

            $table->index(
                ['article_id','user_id'],
                'idx_panier_article_user'
            );

        });

        // INDEX péremption
        Schema::table('entree_details', function (Blueprint $table) {

            $table->index('date_peremption','idx_peremption');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
        
        Schema::table('entree_details', function (Blueprint $table) {

            $table->dropIndex('idx_fifo_lot');
            $table->dropIndex('idx_peremption');

        });

        Schema::table('paniers', function (Blueprint $table) {

            $table->dropIndex('idx_panier_user');
            $table->dropIndex('idx_panier_article_user');

        });
    }
};
