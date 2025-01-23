<?php

namespace Database\Factories;

use App\Models\Storage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => fake()->unique()->numberBetween(6000, 7000),
            'manager' => fake()->name(),
            'pharmacist' => $this->faker->name(),
            'status' => $this->faker->randomElement(['Pending', 'In Progress', 'Done']),
            'storage_id' => Storage::inRandomOrder()->first()->id,
        ];
    }
}
