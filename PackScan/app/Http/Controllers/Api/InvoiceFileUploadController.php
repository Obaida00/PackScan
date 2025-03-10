<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

class InvoiceFileUploadController extends Controller
{
    public function upload(Request $request)
    {
        Log::info("New invoice file recieved");

        try {
            if (!$request->hasFile('file')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No file uploaded'
                ], 422);
            }

            $file = $request->file('file');
            $fileName = "report_" . time() . "_" . uniqid() . ".xlsx";
            $file->storeAs('uploads', $fileName, 'public');

            $this->createInvoiceFromFile($fileName);

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function createInvoiceFromFile(string $filePath)
    {
        try {
            $fullPath = storage_path("app/public/uploads/" . $filePath);

            $spreadsheet = IOFactory::load($fullPath);
            $sheet = $spreadsheet->getActiveSheet();
            $data = $sheet->toArray();

            $invoiceData = $this->extractInvoiceDataFromXlsxDataArray($data);

            $invoiceData = $this->validateInvoiceFileData($invoiceData);

            $invoice = $this->createInvoiceFromData($invoiceData);

            unlink($fullPath);
            Log::info("Invoice ID {$invoice->invoice_id} created/updated successfully");
        } catch (\Exception $e) {
            Log::error('Error processing invoice file: ' . $e->getMessage());
            throw $e;
        }
    }

    private function extractInvoiceDataFromXlsxDataArray(array $data): array
    {
        $totalRowCount = count($data);
        if ($totalRowCount < 7) {
            throw new \DateException("Uploaded file data is invalid, it has only $totalRowCount rows");
        }

        $invoiceData = [
            'invoice_id' => (int)$this->parseNumericString($data[4][2]),
            'pharmacist' => (string)$data[3][1],
            'statement' => (string)$data[4][1],
            'date' => (string)$data[3][4],
            'net_price' => (float)$this->parseNumericString($data[$totalRowCount - 3][2]),
            'number_of_items' => (int)$this->parseNumericString($data[$totalRowCount - 1][3]),
        ];

        $numberOfItems = $invoiceData['number_of_items'];
        $invoiceItems = [];

        $start = 6;
        $end = $start + $numberOfItems;
        for ($i = $start; $i < $end; $i++) {
            $itemData = $data[$i];
            $invoiceItems[] = [
                'collectionName' => (string)$itemData[0],
                'productName' => (string)$itemData[1],
                'quantity' => (int)$this->parseNumericString($itemData[2]),
                'unit_price' => (float)$this->parseNumericString($itemData[4]),
                'total_price' => (float)$this->parseNumericString($itemData[5]),
            ];
        }

        if (array_filter($data[$end], fn($dataCell) => $dataCell !== null)) {
            throw new \DomainException("Item count mismatch");
        }

        $invoiceData['items'] = $invoiceItems;

        return $invoiceData;
    }

    private function validateInvoiceFileData(array $invoiceData): array
    {
        $validator = Validator::make($invoiceData, [
            'invoice_id' => ['required', 'integer'],
            'statement' => ['required', 'string'],
            'pharmacist' => ['required', 'string'],
            'date' => ['required', 'string'],
            'net_price' => ['required', 'integer'],
            'items' => ['sometimes', 'array'],
            'items.*.collectionName' => ['required', 'string'],
            'items.*.productName' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer'],
            'items.*.unit_price' => ['required', 'numeric'],
            'items.*.total_price' => ['required', 'numeric'],
        ]);

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        return $validator->validated();
    }

    private function createInvoiceFromData(array $invoiceData): Invoice
    {
        Log::info("Storing new invoice from file");

        $collectionNames = collect($invoiceData['items'])
            ->pluck('collectionName')
            ->unique()
            ->values()
            ->all();
        $storage = $this->getStorageByCollections($collectionNames);
        Log::info("The invoice belongs to the storage: {$storage->name}");

        $invoiceId = (int)$invoiceData['invoice_id'];

        $this->fillMissingInvoices($storage->id, $invoiceId);

        $invoice = $this->createOrUpdateInvoiceModel($invoiceId, $storage->id, $invoiceData['statement'], $invoiceData['pharmacist'], $invoiceData['date'], $invoiceData['net_price']);

        $this->updateInvoiceItems($invoice, $invoiceData['items']);

        return $invoice;
    }

    private function getStorageByCollections(array $collectionNames): Storage
    {
        //todo search & validate storage with collections
        return Storage::first();
    }

    private function fillMissingInvoices($storageId, $newInvoiceId)
    {
        $lastInvoice = Invoice::where('storage_id', $storageId)
            ->orderBy('invoice_id', 'desc')
            ->first();

        $lastInvoiceId = $lastInvoice ? (int)$lastInvoice->invoice_id : $newInvoiceId;

        if ($newInvoiceId > $lastInvoiceId + 1) {
            Log::info("Detected gap in invoice sequence. Creating missing invoices.");
            for ($id = $lastInvoiceId + 1; $id < $newInvoiceId; $id++) {
                Invoice::create([
                    'invoice_id' => $id,
                    'storage_id' => $storageId,
                    'is_missing' => true,
                    'statement' => null,
                    'pharmacist' => null,
                    'date' => null,
                    'net_price' => null,
                    'status' => null,
                    'packer_id' => null,
                ]);
                Log::info("Created missing invoice for storage: $storageId with ID: $id");
            }
        }
    }

    private function createOrUpdateInvoiceModel($invoiceId, $storageId, $statement, $pharmacist, $date, $netPrice): Invoice
    {
        $invoice = Invoice::where('invoice_id', $invoiceId)
            ->where('storage_id', $storageId)
            ->first();

        if ($invoice) {
            Log::info("Updating existing invoice ID: {$invoice->invoice_id}");
            $invoice->statement = $statement;
            $invoice->pharmacist = $pharmacist;
            $invoice->date = $date;
            $invoice->net_price = $netPrice;
            $invoice->status = "Pending";
            $invoice->is_important = true;
            $invoice->save();
        } else {
            Log::info("Creating new invoice ID: {$invoiceId}");
            $invoice = Invoice::create([
                'invoice_id' => $invoiceId,
                'storage_id' => $storageId,
                'statement' => $statement,
                'pharmacist' => $pharmacist,
                'date' => $date,
                'net_price' => $netPrice,
                'status' => "Pending",
            ]);
        }

        return $invoice;
    }

    private function updateInvoiceItems($invoice, $newItems)
    {
        $oldItems = $invoice->invoiceItems()->with('product')->get();

        $newItemNames = collect($newItems)->pluck('productName')->unique();

        $products = Product::whereIn('name', $newItemNames)->get()->keyBy('name');

        $errors = [];

        $existingItemsByProduct = $oldItems->keyBy(function ($item) {
            return $item->product->name;
        });

        // Process each new item.
        foreach ($newItems as $item) {
            $product = $products->get($item['productName']);
            if (!$product) {
                Log::error("Product " . $item['productName'] . " not found");
                $errors[] = "Product " . $item['productName'] . " not found.";
                continue;
            }

            // If an invoice item for this product already exists, update it.
            if ($existingItemsByProduct->has($product->name)) {
                $invoiceItem = $existingItemsByProduct->get($product->name);
                $invoiceItem->total_count = $item['quantity'];
                $invoiceItem->save();

                // Remove this item from the collection so that remaining ones are those
                // that are not present in the new request.
                $existingItemsByProduct->forget($product->name);
            } else {
                $invoiceItem = new InvoiceItem([
                    "total_count" => $item['quantity'],
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
            throw new \DomainException(implode(" - ", $errors));
        }
    }

    private function parseNumericString(?string $str)
    {
        return str_replace(',', '', $str);
    }
}
