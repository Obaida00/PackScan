<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Storage;
use App\Services\InvoiceQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use function Pest\Laravel\json;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info("Invoice index called");

        $filter = new InvoiceQuery();
        $queryItems = $filter->transform($request); // [['column', 'operator', 'value']]

        if (!empty($queryItems)) {
            $invoices = Invoice::where($queryItems)
                ->orderBy('id', 'desc');
        } else {
            $invoices = Invoice::orderBy('id', 'desc');
        }

        $invoices = $invoices->paginate(10);
        return InvoiceResource::collection($invoices);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        Log::info("storing new invoice");

        $storage = $this->getStorageByCode($request->storage);
        Log::info("The invoice belongs to the storage: {$storage->name}");

        $manager = $request->storage . " manager";
        //todo manager will be linked by id, maybe the id will be sent with the request body

        $this->deleteInvoiceIfExists($request->id);

        $invoice = Invoice::create([
            'id' => $request->id,
            'manager' => $manager,
            'storage_id' => $storage->id,
            'pharmacist' => $request->pharmacist,
            'status' => "Pending",
        ]);

        // Collect all product names from the items and fetch matching package items in one go
        $productNames = collect($request->items)->pluck('name')->unique();
        $products = Product::whereIn('name', $productNames)->get()->keyBy('name');

        // Collect errors for products not found
        $errors = [];

        foreach ($request->items as $item) {
            $product = $products->get($item['name']);

            if (!$product) {
                Log::error("Product " . $item['name'] . " not found");
                $errors[] = "Product " . $item['name'] . " not found.";
                continue;
            }

            $invoiceItem = new InvoiceItem();
            $invoiceItem->total_count = $item['total_count'];
            $invoiceItem->invoice()->associate($invoice);
            $invoiceItem->product()->associate($product);

            $invoice->invoiceItems()->save($invoiceItem);
            $product->invoiceItems()->save($invoiceItem);
        }

        if (count($errors) > 0) {
            return response()->json(['message' => implode(', ', $errors)], 404);
        }

        return response()->json(['message' => "Invoice created successfully"]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        return new InvoiceResource($invoice);
    }

    /**
     * mark the current invoice as Done
     */
    public function markInvoiceAsDone(int $invoice)
    {
        $invoice = Invoice::find($invoice);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found.'], 404);
        }

        $invoice->status = "Done";
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
            return response()->json([
                'message' => "Storage with code {$storageCode} not found."
            ], 404);
        }

        return $storage;
    }

    protected function deleteInvoiceIfExists(int $invoiceId)
    {
        $invoice = Invoice::find($invoiceId);

        if ($invoice) {
            InvoiceItem::where('invoice_id', $invoice->id)->delete();

            $invoice->delete();
            Log::info(`Old invoice has been removed, id: {$invoice->id}`);
        }
    }
}
