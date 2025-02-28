<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Storage;
use App\Models\Product;
use App\Models\Packer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_an_invoice()
    {
        // Create a Storage entry
        $storage = Storage::factory()->create([
            'code' => 'mo',
            'name' => 'almousoaa'
        ]);

        // Create a product for the invoice
        $product = Product::factory()->create();

        // Prepare the request payload
        $data = [
            'invoice_id'    => 1,
            'pharmacist'    => 'John Doe',
            'storage'       => 'mo',
            'statement'     => 'Test statement',
            'date'          => '2025-03-01',
            'net_price'     => 1000,
            'items'         => [
                [
                    'name'         => $product->name,
                    'total_count'  => 5,
                    'unit_price'   => 10,
                    'total_price'  => 50,
                ]
            ]
        ];

        // Send POST request to store an invoice
        $response = $this->postJson('/api/invoices', $data);

        // Check the response status and content
        $response->assertStatus(200);
        $response->assertJson(['message' => 'Invoice created/updated successfully']);

        // Assert that the invoice and the associated invoice item exist in the database
        $this->assertDatabaseHas('invoices', [
            'invoice_id' => 1,
            'manager'    => 'mo manager',
            'storage_id' => $storage->id,
        ]);

        $invoice = Invoice::where('invoice_id', 1)
            ->where('storage_id', $storage->id)
            ->first();
        $this->assertNotNull($invoice);

        $this->assertDatabaseHas('invoice_items', [
            'invoice_id'  => $invoice->id,
            'total_count' => 5,
        ]);
    }

    /** @test */
    public function it_fails_to_create_invoice_if_storage_is_not_found()
    {
        // Prepare the request payload with an invalid storage code
        $data = [
            'invoice_id'    => 1,
            'pharmacist'    => 'John Doe',
            'storage'       => 'invalid_storage', // Non-existent storage
            'statement'     => 'Test statement',
            'date'          => '2025-03-01',
            'net_price'     => 1000,
            'items'         => [
                [
                    'name'         => 'Invalid Product',
                    'total_count'  => 5,
                    'unit_price'   => 10,
                    'total_price'  => 50,
                ]
            ]
        ];

        // Send POST request
        $response = $this->postJson('/api/invoices', $data);

        // Assert that the correct error message is returned
        $response->assertStatus(422);
        $response->assertJson(['message' => 'The storage code must exist in our records.']);
    }

    /** @test */
    public function it_can_mark_invoice_as_done()
    {
        // Create a storage and invoice
        $storage = Storage::factory()->create([
            'code' => 'mo'
        ]);

        // Create a packer who can submit invoices.
        $packer = Packer::factory()->create();

        $invoice = Invoice::factory()->create([
            'invoice_id' => 100,
            'storage_id' => $storage->id,
            'status'     => 'Pending',
        ]);

        $data = [
            'packer_id'         => $packer->id,
            'number_of_packages' => 5,
            'mode'              => 'A'
        ];

        // Send POST request to mark the invoice as 'Done'
        $response = $this->postJson("/api/invoices/{$invoice->id}/done", $data);

        // Check if the invoice status has been updated
        $response->assertStatus(200);
        $response->assertJson(['data' => ['status' => 'Done']]);

        // Assert that the invoice status has been updated in the database.
        $this->assertDatabaseHas('invoices', [
            'invoice_id' => 100,
            'storage_id' => $storage->id,
            'status'     => 'Done',
        ]);
    }

    /** @test */
    public function it_makes_invoice_relationships()
    {
        // Create a Product
        $product = Product::factory()->create();

        // Create a Storage record
        $storage = Storage::factory()->create();

        // Create an Invoice and associate it with the created Storage
        $invoice = Invoice::create([
            'invoice_id' => 123,
            'manager'    => 'Manager Name',
            'storage_id' => $storage->id,
            'pharmacist' => 'Pharmacist Name',
            'status'     => 'Pending',
            'statement'  => 'Test statement',
            'date'       => '2025-03-01',
            'net_price'  => 1000
        ]);

        // Create an InvoiceItem and associate it with the Product and the Invoice
        InvoiceItem::create([
            'total_count' => 10,
            'invoice_id'  => $invoice->id,
            'product_id'  => $product->id,
            'unit_price'  => 10,
            'total_price' => 100,
        ]);

        // Reload the invoice to check relationships
        $invoice->load('invoiceItems.product');  // Ensure that relationship is loaded

        // Assertions
        $this->assertCount(1, $invoice->invoiceItems);
        $this->assertEquals($product->id, $invoice->invoiceItems->first()->product->id);
    }

    /** @test */
    public function it_can_replace_invoice_with_matching_id()
    {
        // Create a product
        $product = Product::factory()->create();

        // Create a storage record
        $storage = Storage::factory()->create([
            'name' => 'almousoaa',
            'code' => 'mo',
        ]);

        // Create an initial invoice (this invoice will be replaced later)
        $invoice = Invoice::create([
            'invoice_id' => 123,
            'manager'    => 'mo manager',
            'storage_id' => $storage->id,
            'pharmacist' => 'Pharmacist Name',
            'status'     => 'Pending',
            'statement'  => 'Initial statement',
            'date'       => '2025-03-01',
            'net_price'  => 1000,
        ]);

        // Create an InvoiceItem for the initial invoice
        InvoiceItem::create([
            'total_count' => 10,
            'invoice_id'  => $invoice->id,
            'product_id'  => $product->id,
            'unit_price'  => 10,
            'total_price' => 100,
        ]);

        // Assert the initial invoice exists and has the product
        $this->assertDatabaseHas('invoices', ['invoice_id' => 123, 'manager' => 'mo manager']);
        $this->assertCount(1, $invoice->invoiceItems);

        // Now, prepare new invoice data to replace the old one (same ID)
        $newProduct = Product::factory()->create();
        $newInvoiceData = [
            'invoice_id' => 123, // Same ID, indicating a replacement
            'storage'    => $storage->code, // same storage code
            'pharmacist' => 'New Pharmacist Name',
            'statement'  => 'Updated statement',
            'date'       => '2025-04-01',
            'net_price'  => 1000,
            'items'      => [
                [
                    'name'         => $newProduct->name,
                    'total_count'  => 20,
                    'unit_price'   => 15,
                    'total_price'  => 300,
                ],
            ]
        ];

        // Send a POST request to the store endpoint (assuming it's POST /invoices)
        $response = $this->postJson('/api/invoices', $newInvoiceData);

        // Check if the response status is OK (or 200)
        $response->assertStatus(200);

        // Assert that the invoice has been replaced in the database
        $this->assertDatabaseHas('invoices', [
            'invoice_id' => 123,
            'manager'    => 'mo manager',
            'pharmacist' => 'New Pharmacist Name',
        ]);

        // Assert that the invoice items have been updated.
        $updatedInvoice = Invoice::where('invoice_id', 123)
            ->where('storage_id', $storage->id)
            ->first();
        $this->assertCount(2, $updatedInvoice->invoiceItems);

        //invoice item with total count of 0 should be deleted after marking as done
        $packer = Packer::factory()->create([
            'can_submit_important_invoices' => true
        ]);

        $data = [
            'packer_id'         => $packer->id,
            'number_of_packages' => 5,
            'mode'              => 'A'
        ];

        // Send POST request to mark the invoice as 'Done'
        $response = $this->postJson("/api/invoices/{$invoice->id}/done", $data);

        // Check if the invoice status has been updated
        $response->assertStatus(200);
        $response->assertJson(['data' => ['status' => 'Done']]);

        // Assert that the invoice status has been updated in the database.
        $this->assertDatabaseHas('invoices', [
            'invoice_id' => 123,
            'storage_id' => $storage->id,
            'status'     => 'Done',
        ]);
        $done_invoice = Invoice::where('invoice_id', 123)
            ->where('storage_id', $storage->id)
            ->first();
        $this->assertCount(1, $done_invoice->invoiceItems);
    }

    //todo add tests for packer permissions
}
