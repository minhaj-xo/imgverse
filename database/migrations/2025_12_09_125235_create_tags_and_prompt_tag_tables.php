<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 100)->unique();
            $table->string('slug', 120)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('prompt_tag', function (Blueprint $table) {
            $table->foreignId('prompt_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['prompt_id', 'tag_id']);
            $table->index(['tag_id', 'prompt_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prompt_tag');
        Schema::dropIfExists('tags');
    }
};
