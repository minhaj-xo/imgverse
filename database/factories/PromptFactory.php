<?php

namespace Database\Factories;

use App\Models\Prompt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PromptFactory extends Factory
{
    protected $model = Prompt::class;

    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->numberBetween(1, 999999),
            'body' => fake()->paragraphs(3, true),
            'type' => fake()->randomElement(['text2image', 'image2text']),
            'visibility' => 'public',
            'status' => 'active',
            'nsfw' => false,
            'like_count' => 0,
            'comment_count' => 0,
            'save_count' => 0,
            'view_count' => fake()->numberBetween(0, 5000),
            'published_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
