<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\PackageItem;
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
        Log::info("invoice index called");
        $filter = new InvoiceQuery();
        $queryItems = $filter->transform($request); //[['column', 'operator', 'value']]

        return InvoiceResource::collection(
            Invoice::where($queryItems)
                ->orderBy('id', 'desc')
                ->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        Log::info("storing new invoice");
        //create the invoice
        $manager = $request->storage . " manager";
        $storage = Storage::firstOrCreate(["code" => $request->storage], [
            "name" => $request->storage . " name",
            "code" => $request->storage,
        ]);
        Log::info(`the invoice belongs to the storage: {$storage->name}`);
        $invoice = Invoice::find($request->id);
        if ($invoice != null) {
            $oldInvoiceItems = InvoiceItem::where('invoice_id', $invoice->id);
            foreach ($oldInvoiceItems as $invoiceItem) {
                $invoiceItem->delete();
            }
            Invoice::destroy($invoice->id);
        }

        $invoice = Invoice::Create(
            [
                'id' => $request->id,
                'manager' => $manager,
                'storage_id' => $storage->id,
                'pharmacist' => $request->pharmacist,
                'status' => "Pending",
            ]
        );
        return response()->json(['message' => "invoice created successfully"]);

        // Collect all product names from the items
        $productNames = collect($request->items)->pluck('name')->unique();

        // Fetch all matching products in one query
        $packageItems = PackageItem::whereIn('name', $productNames)->get()->keyBy('name');

        foreach ($request->items as $item) {
            //todo THIS DOES'T SEEM RIGHT
            $packageItem = $packageItems->get($item['name']);

            if (!$packageItem) {
                Log::error("Product " . $item['name'] . " not found");
                return response()->json([
                    'message' => "Product " . $item['name'] . " not found."
                ], 404);
            }

            // Create the items
            $invoiceItem = new InvoiceItem();

            $invoiceItem->total_count = $item['totalCount'];
            $invoiceItem->invoice()->associate($invoice);
            $invoiceItem->packageItem()->associate($packageItem);

            $invoice->invoiceItems()->save($invoiceItem);
            $packageItem->invoiceItems()->save($invoiceItem);

            return response()->json(['message' => "invoice created successfully"]);
        }



        //todo storing files
        // add file extension and complete the put and get of files
        // Storage::put('filebase/' . $invoice->id, $request['content']);
        return response((new InvoiceResource($invoice))->toJson(), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        return new InvoiceResource($invoice);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        $data = $request->toArray();
        $invoice->update($data);

        return new InvoiceResource($invoice);
    }

    /**
     * mark the current invoice as Done
     */
    public function markInvoiceAsDone(int $invoice)
    {
        $invoice = Invoice::find($invoice);
        $invoice->status = "Done";
        $invoice->save();

        return new InvoiceResource($invoice);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        //todo delete the stored file or move to trash folder
        $invoice->delete();
        return response("", 204);
    }
}
