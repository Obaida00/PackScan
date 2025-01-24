<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Storage;
use App\Models\Product;
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
            'id' => 1,
            'pharmacist' => 'John Doe',
            'storage' => 'mo', // We assume this refers to the 'code'
            'items' => [
                [
                    'name' => $product->name,
                    'total_count' => 5
                ]
            ]
        ];

        // Send POST request to store an invoice
        $response = $this->postJson('/api/invoices', $data);

        // Check the response status and content
        $response->assertStatus(200);
        $response->assertJson(['message' => 'Invoice created successfully']);

        // Assert that the invoice and the associated invoice item exist in the database
        $this->assertDatabaseHas('invoices', [
            'id' => 1,
            'manager' => 'mo manager', // Depending on your logic
            'storage_id' => $storage->id,
        ]);

        $this->assertDatabaseHas('invoice_items', [
            'invoice_id' => 1,
            'total_count' => 5,
        ]);
    }

    /** @test */
    public function it_fails_to_create_invoice_if_storage_is_not_found()
    {
        // Prepare the request payload with an invalid storage code
        $data = [
            'id' => 1,
            'pharmacist' => 'John Doe',
            'storage' => 'invalid_storage', // Non-existent storage
            'items' => [
                [
                    'name' => 'Invalid Product',
                    'total_count' => 5
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
        $storage = Storage::factory()->create();
        $invoice = Invoice::factory()->create([
            'storage_id' => $storage->id,
            'status' => 'Pending',
        ]);

        // Send PUT request to mark the invoice as 'Done'
        $response = $this->postJson("/api/invoices/{$invoice->id}/done");

        // Check if the invoice status has been updated
        $response->assertStatus(200);
        $response->assertJson(['data' => ['status' => 'Done']]);
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
            'id' => 123,
            'manager' => 'Manager Name',
            'storage_id' => $storage->id, // Use the created Storage's id
            'pharmacist' => 'Pharmacist Name',
            'status' => 'Pending',
        ]);

        // Create an InvoiceItem and associate it with the Product and the Invoice
        $invoiceItem = InvoiceItem::create([
            'total_count' => 10,
            'invoice_id' => $invoice->id,
            'product_id' => $product->id,
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
            'name'=> 'almousoaa',
            'code'=> 'mo',
        ]);

        // Create an initial invoice (this invoice will be replaced later)
        $invoice = Invoice::create([
            'id' => 123,
            'manager' => 'mo manager',
            'storage_id' => $storage->id,
            'pharmacist' => 'Pharmacist Name',
            'status' => 'Pending',
        ]);

        // Create an InvoiceItem for the initial invoice
        InvoiceItem::create([
            'total_count' => 10,
            'invoice_id' => $invoice->id,
            'product_id' => $product->id,
        ]);

        // Assert the initial invoice exists and has the product
        $this->assertDatabaseHas('invoices', ['id' => $invoice->id]);
        $this->assertCount(1, $invoice->invoiceItems);

        // Now, prepare new invoice data to replace the old one (same ID)
        $newProduct = Product::factory()->create();
        $anotherStorage = Storage::factory()->create([
            'name'=> 'advanced',
            'code'=> 'ad',
        ]);

        $newInvoiceData = [
            'id' => 123, // Same ID, indicating a replacement
            'manager' => 'ad manager',
            'storage' => $anotherStorage->code,
            'pharmacist' => 'New Pharmacist Name',
            'status' => 'Done',
            'items' => [
                [
                    'name' => $newProduct->name,
                    'total_count' => 20,
                    'price' => 100,
                ],
            ]
        ];

        // Send a POST request to the store endpoint (assuming it's POST /invoices)
        $response = $this->postJson('/api/invoices', $newInvoiceData);

        // Check if the response status is OK (or 200)
        $response->assertStatus(200);

        // Assert that the invoice has been replaced in the database
        $this->assertDatabaseHas('invoices', ['id' => 123, 'manager' => 'ad manager']);

        // Assert that the old invoice was replaced (i.e., it's no longer in the database)
        $this->assertDatabaseMissing('invoices', ['id' => 123, 'manager' => 'mo manager']);

        // Assert that the new invoice has the new Product
        $this->assertCount(1, $invoice->fresh()->invoiceItems); // Ensure invoice is refreshed
        $this->assertEquals($newProduct->id, $invoice->fresh()->invoiceItems->first()->product->id);
    }
}
