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
        Schema::create('pourcentages', function (Blueprint $table) {
            $table->id();
            $table->integer('pourcentage');
            $table->timestamps();
        });

          DB::table('pourcentages')->insert([
            ['pourcentage' => 20, 'created_at' => now(), 'updated_at' => now()],
          ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pourcentages');
    }
};
