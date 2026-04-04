<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDestinationIdToTourGuidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tour_guides', function (Blueprint $table) {
            $table
                ->foreignId('destination_id')
                ->nullable()
                ->after('id')
                ->constrained('tour_destinations')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tour_guides', function (Blueprint $table) {
            $table->dropConstrainedForeignId('destination_id');
        });
    }
}
