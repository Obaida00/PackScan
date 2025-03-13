<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Packer;
use App\Models\Product;
use App\Models\Storage;
use App\Services\InvoiceQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use function Spatie\LaravelPdf\Support\pdf;

class InvoiceController extends Controller
{
    public function generatePdf(string $id)
    {
        $invoice = Invoice::with('invoiceItems.product')->findOrFail($id);

        
        $pdf = pdf()
            ->margins(0, 0, 0, 0)
            ->format('A5')
            ->view('invoicePdf', ['invoice' => $invoice,]);
        return $pdf;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info("Invoice index called");

        $filter = new InvoiceQuery();
        $queryItems = $filter->transform($request); // [['column', 'operator', 'value']]

        $invoices = Invoice::with('packer');
        if (!empty($queryItems)) {
            $invoices = $invoices->where($queryItems);
        }
        $invoices = $invoices->orderBy('invoice_id', 'desc');


        $invoices = $invoices->paginate(10)->appends($request->input());
        return InvoiceResource::collection($invoices);
    }

    /**
     * Store a resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        Log::info("storing new invoice");

        $storage = $this->getStorageByCode($request->storage);
        Log::info("The invoice belongs to the storage: {$storage->name}");

        // Find the highest existing invoice_id for the storage
        $lastInvoice = Invoice::where('storage_id', $storage->id)
            ->orderBy('invoice_id', 'desc')
            ->first();

        $newInvoiceId = (int)$request->invoice_id;
        $lastInvoiceId = $lastInvoice ? (int)$lastInvoice->invoice_id : $newInvoiceId;

        if ($newInvoiceId > $lastInvoiceId + 1) {
            Log::info("Detected gap in invoice sequence. Creating missing invoices.");
            for ($id = $lastInvoiceId + 1; $id < $newInvoiceId; $id++) {
                Invoice::create([
                    'invoice_id' => $id,
                    'storage_id' => $storage->id,
                    'is_missing' => true,
                    'statement' => null,
                    'pharmacist' => null,
                    'date' => null,
                    'net_price' => null,
                    'status' => null,
                    'packer_id' => null,
                ]);
                Log::info("Created missing invoice with ID: $id");
            }
        }

        $invoice = Invoice::where('invoice_id', $request->invoice_id)
            ->where('storage_id', $storage->id)
            ->first();

        if ($invoice) {
            $invoice->storage_id = $storage->id;
            $invoice->statement = $request->statement;
            $invoice->pharmacist = $request->pharmacist;
            $invoice->date = $request->date;
            $invoice->net_price = $request->net_price;
            $invoice->status = "Pending";
            $invoice->is_important = true;
            $invoice->save();
        } else {
            $invoice = Invoice::create([
                'invoice_id' => $request->invoice_id,
                'storage_id' => $storage->id,
                'statement' => $request->statement,
                'pharmacist' => $request->pharmacist,
                'date' => $request->date,
                'net_price' => $request->net_price,
                'status' => "Pending",
            ]);
        }

        // --- Invoice Items Processing ---

        $newItems = $request->items;

        // Get unique product names from the request.
        $newItemNames = collect($newItems)->pluck('name')->unique();

        // Fetch all products matching the names.
        $products = Product::whereIn('name', $newItemNames)->get()->keyBy('name');

        // Collect errors for products not found.
        $errors = [];

        // Get the existing invoice items.
        $existingItems = $invoice->invoiceItems()->with('product')->get();

        // Key the existing items by product name.
        $existingItemsByProduct = $existingItems->keyBy(function ($item) {
            return $item->product->name;
        });

        // Process each new item from the request.
        foreach ($newItems as $item) {
            $product = $products->get($item['name']);
            if (!$product) {
                Log::error("Product " . $item['name'] . " not found");
                $errors[] = "Product " . $item['name'] . " not found.";
                continue;
            }

            // If an invoice item for this product already exists, update it.
            if ($existingItemsByProduct->has($product->name)) {
                $invoiceItem = $existingItemsByProduct->get($product->name);
                $invoiceItem->total_count = $item['total_count'];
                $invoiceItem->save();

                // Remove this item from the collection so that remaining ones are those
                // that are not present in the new request.
                $existingItemsByProduct->forget($product->name);
            } else {
                $invoiceItem = new InvoiceItem([
                    "total_count" => $item['total_count'],
                    "unit_price" => $item['unit_price'],
                    "total_price" => $item['total_price'],
                    'current_count' => 0
                ]);
                $invoiceItem->invoice()->associate($invoice);
                $invoiceItem->product()->associate($product);
                $invoiceItem->save();
            }
        }

        // For any remaining existing invoice items (i.e. those not included in the new request),
        // update their total_count to zero while preserving the current_count.
        foreach ($existingItemsByProduct as $invoiceItem) {
            $invoiceItem->total_count = 0;
            $invoiceItem->save();
        }

        if (count($errors) > 0) {
            return response()->json(['message' => implode(', ', $errors)], 404);
        }

        return response()->json(['message' => "Invoice created/updated successfully"]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        return new InvoiceResource($invoice);
    }

    /**
     * Mark the current invoice as Done and associate it with a packer.
     */
    public function markInvoiceAsDone(Request $request, string $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found.'], 404);
        }

        $request->validate([
            'packer_id' => 'required|exists:packers,id',
            'number_of_packages' => 'required|integer|gt:0',
            'mode' => 'required|in:M,A'
        ]);

        $packer = Packer::find($request->packer_id);
        if (!$packer) {
            return response()->json(['message' => 'Packer not found.'], 404);
        }

        if ($invoice->is_important && !$packer->can_submit_important_invoices) {
            return response()->json(['message' => 'Packer Cannot Submit Edited Invoices.'], 403);
        }

        if ($request->mode == 'M' && !$packer->can_manually_submit) {
            return response()->json(['message' => 'Packer Cannot Manually Submit Invoices.'], 403);
        }

        $invoice->packer_id = $request->packer_id;
        $invoice->number_of_packages = $request->number_of_packages;
        $invoice->status = "Done";
        $invoice->is_important = false;
        $invoice->submittion_mode = $request->mode;
        $invoice->done_at = now();
        $invoice->save();

        foreach ($invoice->invoiceItems as $invoiceItem) {
            if ($invoiceItem->total_count == 0) {
                $invoiceItem->delete();
            } else {
                $invoiceItem->current_count = $invoiceItem->total_count;
                $invoiceItem->save();
            }
        }

        return new InvoiceResource($invoice);
    }

    /**
     * Mark the current invoice as Sent.
     */
    public function markInvoiceAsSent(Request $request, string $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found.'], 404);
        }

        $invoice->status = "Sent";
        $invoice->sent_at = now();
        $invoice->save();

        return new InvoiceResource($invoice);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found.'], 404);
        }

        $invoice->invoiceItems()->delete();
        $invoice->delete();
        return response("", 204);
    }

    protected function getStorageByCode(string $storageCode): Storage
    {
        $storage = Storage::where("code", $storageCode)->first();

        if (!$storage) {
            Log::error("Storage not found: {$storageCode}");
            response()->json([
                'message' => "Storage with code {$storageCode} not found."
            ], 404);
        }

        return $storage;
    }
}
