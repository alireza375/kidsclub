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
        Schema::table('users', function (Blueprint $table) {
            $table->longText('education')->nullable()->change();
            $table->longText('experience')->nullable()->change();
            $table->longText('skill')->nullable()->change();
            $table->longText('achievement')->nullable()->change();
            $table->longText('philosophy')->nullable()->change();
            $table->longText('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('education')->nullable()->change();
            $table->string('experience')->nullable()->change();
            $table->string('skill')->nullable()->change();
            $table->string('achievement')->nullable()->change();
            $table->string('philosophy')->nullable()->change();
            $table->string('description')->nullable()->change();
        });
    }
};
