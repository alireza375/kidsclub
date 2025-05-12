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
        Schema::table('products', function (Blueprint $table) {
            //
            $table->decimal('discount_price', 8, 2)->default(0.00)->nullable();
            $table->decimal('discount', 8, 2)->default(0.00)->nullable();
            $table->string('discount_type')->nullable(); // percentage or fixed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
            $table->dropColumn('discount_price');
            $table->dropColumn('discount');
            $table->dropColumn('discount_type');
        });
    }
};
