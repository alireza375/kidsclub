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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('title');
            $table->json('description')->nullable();
            $table->string('image')->nullable();
            $table->foreignId('instructor_id')->nullable()->constrained('users');
            $table->decimal('price', 8, 2)->default(0.00);
            $table->decimal('discount_price', 8, 2)->default(0.00)->nullable();
            $table->decimal('discount', 8, 2)->default(0.00)->nullable();
            $table->string('discount_type')->nullable();
            $table->json('category')->nullable();
            $table->string('session')->nullable();
            $table->string('duration')->nullable();
            $table->integer('capacity')->nullable();
            $table->json('service_news')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
