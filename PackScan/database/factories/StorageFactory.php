<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Storage>
 */
class StorageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement(["almousoaa", "advanced"]);
        $code = $name == "almousoaa" ? "mo" : "ad";

        return [
            "name" => $name,
            "code" => $code
        ];
    }
}
