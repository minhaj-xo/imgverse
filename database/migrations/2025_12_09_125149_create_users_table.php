<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->unique();
            $table->string('username', 50)->unique();
            $table->string('name', 100)->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('avatar_url')->nullable();
            $table->string('bio', 280)->nullable();
            $table->string('website_url')->nullable();
            $table->string('location', 100)->nullable();
            $table->string('role', 20)->default('user');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index('created_at');
            $table->index('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
