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
        Schema::table('services', function (Blueprint $table) {
             $table->integer('isConsult')->default(0)->after('prix_service');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       
    }
};
