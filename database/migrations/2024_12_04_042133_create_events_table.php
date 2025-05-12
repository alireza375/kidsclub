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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->json('description')->nullable();
            $table->date('event_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->json('members')->nullable();
            $table->foreignId('instructor_id')->nullable()->constrained('users');
            $table->string('location');
            $table->decimal('discount_price', 8, 2)->default(0.00)->nullable();
            $table->decimal('original_price', 8, 2)->default(0.00)->nullable();
            $table->json('event_category')->nullable();
            $table->string('session')->nullable();
            $table->string('duration')->nullable();
            $table->integer('capacity')->nullable();
            $table->string('contact_address')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->json('event_news')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
