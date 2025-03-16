<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InvoiceItem>
 */
class InvoiceItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 30);
        $gifted_quantity = fake()->numberBetween(1, 10);
        $total_count = $quantity + $gifted_quantity;
        $unit_price = fake()->numberBetween(1000, 10000);
        $total_price = $total_count * $unit_price;

        return [
            'invoice_id' => Invoice::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'gifted_quantity' => $gifted_quantity,
            'total_count' => $total_count,
            'total_price' => $total_price,
            'public_price' => $total_price,
            'unit_price' => $unit_price
        ];
    }
}
