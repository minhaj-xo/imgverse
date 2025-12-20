<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prompt_images', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('prompt_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->unsignedInteger('position')->default(0);
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->string('format', 20)->nullable();
            $table->timestamps();

            $table->index(['prompt_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prompt_images');
    }
};
