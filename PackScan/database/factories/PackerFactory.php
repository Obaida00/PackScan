<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Packer>
 */
class PackerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->unique()->numberBetween(1000, 9999),
            'name' => $this->faker->name(),
            'can_manually_submit' => $this->faker->boolean(30),
            'can_submit_important_invoices' => $this->faker->boolean(50),
            'is_invoice_admin' => $this->faker->boolean(50)
        ];
    }
}
