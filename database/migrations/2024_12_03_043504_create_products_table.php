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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('short_description');
            $table->json('description');
            $table->decimal('price', 10, 2);
            $table->integer('quantity');
            $table->json('variants');
            $table->string('thumbnail_image');
            $table->json('images')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('publish')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
