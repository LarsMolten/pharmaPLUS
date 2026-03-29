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
         Schema::table('paniers', function (Blueprint $table) {
        $table->string('nom_patient')->nullable()->after('kit_id');
        $table->boolean('sex_patient')->default(true)->after('nom_patient');
        $table->integer('age_patient')->nullable()->after('sex_patient');
        $table->boolean('unite_age')->default(true)->after('age_patient'); //1:ans 0:mois
        $table->string('type_docteur')->nullable()->after('unite_age');
        $table->string('docteur')->nullable()->after('type_docteur');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
