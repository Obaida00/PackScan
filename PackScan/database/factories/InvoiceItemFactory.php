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
        $total_count = fake()->numberBetween(1, 30);
        $unit_price = fake()->numberBetween(1000, 10000);
        $total_price = $total_count * $unit_price;

        return [
            'invoice_id' => Invoice::factory(),
            'product_id' => Product::factory(),
            'total_count' => $total_count,
            'unit_price' => $unit_price,
            'total_price' => $total_price
        ];
    }
}
