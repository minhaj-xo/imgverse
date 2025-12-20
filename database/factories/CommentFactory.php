<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'prompt_id' => Prompt::factory(),
            'user_id' => User::factory(),
            'parent_id' => null,
            'body' => fake()->sentence(20),
            'depth' => 0,
            'is_edited' => false,
            'is_deleted' => false,
            'like_count' => 0,
        ];
    }
}
