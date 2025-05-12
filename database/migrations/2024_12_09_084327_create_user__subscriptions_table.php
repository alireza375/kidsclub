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
        Schema::create('user__subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('uid', 64)->unique();
            $table->string('user_id');
            $table->string('subscription_id');
            $table->string('currency');
            $table->string('langCode');
            $table->decimal('price', 8, 2);
            $table->string('active')->default('false');
            $table->string('method');
            $table->boolean('is_paid')->default(0);
            $table->string('payment_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user__subscriptions');
    }
};
