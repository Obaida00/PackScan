<?php

namespace Database\Seeders;

use App\Models\Collection;
use Illuminate\Database\Seeder;
use App\Models\Storage;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\InvoiceItem;
use App\Models\Packer;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $storages = Storage::factory()->count(2)->create();

        $collections = collect();
        foreach ($storages as $storage) {
            $collections = $collections->merge(
                Collection::factory()
                    ->count(5)
                    ->create(['storage_id' => $storage->id])
            );
        }

        $products = collect();
        foreach ($collections as $collection) {
            $products = $products->merge(
                Product::factory()
                    ->count(5)
                    ->create(['collection_id' => $collection->id])
            );
        }

        $packers = Packer::factory()->count(5)->create();

        Invoice::factory()
            ->count(100)
            ->create()
            ->each(function ($invoice) use ($products) {
                $randomProducts = $products->random(rand(2, 3));
                foreach ($randomProducts as $product) {
                    InvoiceItem::factory()->create([
                        'invoice_id' => $invoice->id,
                        'product_id' => $product->id,
                    ]);
                }
            });
    }
}
