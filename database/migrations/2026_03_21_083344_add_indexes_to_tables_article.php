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
        // INDEX STOCK ARTICLE
        Schema::table('articles', function (Blueprint $table) {

            $table->index(
                ['stock'],
                'idx_article_stock'
            );

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
        Schema::table('articles', function (Blueprint $table) {

            $table->dropIndex('idx_article_stock');

        });
    }
};
