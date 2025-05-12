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
        Schema::table('settings', function (Blueprint $table) {
            $table->string('copyright', 255)->nullable()->after('address');
            $table->string('whatsapp', 20)->nullable()->after('copyright');
            $table->string('breadcrumb', 255)->nullable()->after('whatsapp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn('copyright');
            $table->dropColumn('whatsapp');
            $table->dropColumn('breadcrumb');
        });
    }
};
