<?php

namespace Database\Factories;

use App\Models\PromptSave;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromptSaveFactory extends Factory
{
    protected $model = PromptSave::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'prompt_id' => Prompt::factory(),
        ];
    }
}
