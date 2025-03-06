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
        $done_at = $sent_at = null;
        $status = $this->faker->randomElement(['Pending', 'In Progress', 'Done', 'Sent']);
        if ($status == 'Done' || $status == 'Sent') {
            $done_at = $this->faker->dateTimeBetween('+10 minutes', '+4 hours');
            if ($status == 'Sent') {
                $sent_at = $this->faker->dateTimeBetween('+1 hours', '+4 hours');
            }
        }

        return [
            'invoice_id' => fake()->numberBetween(9860, 9997),
            'statement' => $this->faker->name(),
            'pharmacist' => $this->faker->name(),
            'date' => $this->faker->date(max: "+1 month"),
            'status' => $status,
            'net_price' => $this->faker->numberBetween(100000, 1000000),
            'storage_id' => Storage::inRandomOrder()->first()->id,
            'is_important' => $this->faker->randomElement([true, false]),
            'done_at' => $done_at,
            'sent_at' => $sent_at,
            'submittion_mode' => $this->faker->randomElement(['M', 'A'])
        ];
    }
}
