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
            'id' => fake()->unique()->numberBetween(9000, 9997),
            'manager' => fake()->name(),
            'statement' => $this->faker->name(),
            'pharmacist' => $this->faker->name(),
            'date' => $this->faker->date(max: "+1 month"),
            'status' => $this->faker->randomElement(['Pending', 'In Progress', 'Done']),
            'net_price' => $this->faker->numberBetween(100000, 1000000),
            'storage_id' => Storage::inRandomOrder()->first()->id,
            'is_important' => $this->faker->randomElement([true, false]),
        ];
    }
}
