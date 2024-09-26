<?php

namespace Database\Factories;

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
            'id' => fake()->unique()->numberBetween(1000, 9999),
            'manager' => fake()->name(),
            'pharmacist' => fake()->name(),
            'status' => fake()->randomElement(['Pending', 'In Progress', 'Done']),
        ];
    }
}
