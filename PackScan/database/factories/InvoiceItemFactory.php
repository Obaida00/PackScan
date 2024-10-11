<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\PackageItem;
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
        return [
            'invoice_id' => Invoice::factory(),
            'package_item_id' => PackageItem::factory(),
            'total_count' => fake()->numberBetween(1, 30)
        ];
    }
}
