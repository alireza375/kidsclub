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
            $table->string('phone', 63)->nullable();
            $table->text('image')->nullable();
            $table->tinyInteger('role')->comment('user = 1,admin = 3,coase = 2')->default(USER);
            $table->boolean('status')->default(true);
            $table->boolean('is_mail_verified')->default(DISABLE);
            $table->string('address')->nullable();
            $table->text('social_links')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'image', 'role', 'status', 'is_mail_verified', 'address', 'social_links']);
        });
    }
};
