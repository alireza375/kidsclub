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
        Schema::table('events', function (Blueprint $table) {
            $table->json('organizer')->nullable()->after('members');
            $table->enum('type',['free','paid'])->nullable()->after('organizer');
            $table->dropColumn('discount_price');
            $table->dropColumn('original_price');
            $table->decimal('price', 8, 2)->default(0.00)->nullable()->after('type');
            $table->decimal('discount', 8, 2)->default(0.00)->nullable()->after('price');
            $table->enum('discount_type',['percentage','fixed'])->nullable()->after('discount');
            $table->dropColumn('session');
            $table->dropColumn('duration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('image');
            $table->dropColumn('organizer');
            $table->dropColumn('type');
            $table->decimal('discount_price', 8, 2)->default(0.00);
            $table->decimal('original_price', 8, 2)->default(0.00);
            $table->dropColumn('price');
            $table->dropColumn('discount');
            $table->dropColumn('discount_type');
            $table->string('session');
            $table->string('duration');
            $table->dropColumn('is_active');
        });
    }
};
