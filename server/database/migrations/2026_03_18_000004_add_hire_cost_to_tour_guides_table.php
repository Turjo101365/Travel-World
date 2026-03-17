<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddHireCostToTourGuidesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('tour_guides', function (Blueprint $table) {
            $table->decimal('hire_cost', 10, 2)->default(0)->after('languages');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('tour_guides', function (Blueprint $table) {
            $table->dropColumn('hire_cost');
        });
    }
}
