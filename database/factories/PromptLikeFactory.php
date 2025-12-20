<?php

namespace Database\Factories;

use App\Models\PromptLike;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromptLikeFactory extends Factory
{
    protected $model = PromptLike::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'prompt_id' => Prompt::factory(),
        ];
    }
}
