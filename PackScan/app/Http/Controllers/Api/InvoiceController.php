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
                ->with('packer')
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

        $invoice = Invoice::find($request->id);
        if ($invoice) {
            $invoice->manager = $manager;
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
                'id' => $request->id,
                'manager' => $manager,
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

        // Collect errors for products not found
        $errors = [];

        // Get the existing invoice items
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
    public function markInvoiceAsDone(Request $request, int $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found.'], 404);
        }

        $request->validate([
            'packer_id' => 'required|exists:packers,id',
            'number_of_packages' => 'required|integer|gt:0'
        ]);

        $invoice->packer_id = $request->packer_id;
        $invoice->number_of_packages = $request->number_of_packages;
        $invoice->status = "Done";
        $invoice->is_important = false;
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
}
