<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $username = fake()->unique()->userName();

        return [
            'uuid' => (string) Str::uuid(),
            'username' => $username,
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'avatar_url' => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            'bio' => fake()->optional()->sentence(10),
            'website_url' => fake()->optional()->url(),
            'location' => fake()->optional()->city(),
            'role' => 'user',
            'email_verified_at' => now(),
            'last_login_at' => now(),
        ];
    }
}
