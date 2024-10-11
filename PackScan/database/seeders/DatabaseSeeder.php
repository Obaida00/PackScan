<?php

namespace Database\Seeders;

use App\Models\Invoice;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\InvoiceItem;
use App\Models\PackageItem;
use Illuminate\Database\Seeder;
use App\Models\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $invoices_0 = Invoice::factory()
            ->hasInvoiceItems(20)
            ->count(2)
            ->create(["storage_id" => 0]);


        Storage::factory()
            ->hasInvoices($invoices_0)
            ->create([
                "id" => 0,
                "name" => "almousoaa",
                "code" => "mo"
            ]);


        $invoices_1 = Invoice::factory()
            ->hasInvoiceItems(20)
            ->count(4)
            ->create(["storage_id" => 1]);
            
        Storage::factory()
            ->hasInvoices($invoices_1)
            ->create([
                "id" => 1,
                "name" => "advanced",
                "code" => "ad"
            ]);


    }
}
