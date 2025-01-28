<?php

namespace Database\Seeders;

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
        Packer::factory()->count(10)->create();

        // Create Storage with associated invoices and invoice items
        $this->createStorageWithInvoices([
            'id' => 0,
            'name' => 'almousoaa',
            'code' => 'mo',
        ], 2, 2);

        $this->createStorageWithInvoices([
            'id' => 1,
            'name' => 'advanced',
            'code' => 'ad',
        ], 4, 3);

        // Optionally, seed some standalone products for variety
        Product::factory(10)->create();
    }

    /**
     * Create a storage record with associated invoices and invoice items.
     *
     * @param array $storageData
     * @param int $invoiceCount
     * @param int $invoiceItemsPerInvoice
     */
    private function createStorageWithInvoices(array $storageData, int $invoiceCount, int $invoiceItemsPerInvoice): void
    {
        $storage = Storage::factory()->create($storageData);

        Invoice::factory()
            ->count($invoiceCount)
            ->has(
                InvoiceItem::factory()
                    ->count($invoiceItemsPerInvoice)
                    ->state(function (array $attributes, Invoice $invoice) {
                        return [
                            'product_id' => Product::factory()->create()->id,
                        ];
                    })
            )
            ->create(['storage_id' => $storage->id]);
    }
}
