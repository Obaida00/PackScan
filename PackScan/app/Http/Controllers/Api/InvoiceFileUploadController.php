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
            $fileName = "report_" . time() . "_" . now("+3")->format('M-dD-H-i-s') . "_" . uniqid() . ".xlsx";
            $file->storeAs('uploads', $fileName, 'public');

            $invoice = $this->createInvoiceFromFile($fileName);

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'invoice_id' => $invoice->id
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

            Log::info("Invoice ID {$invoice->invoice_id} created/updated successfully");

            return $invoice;
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
            'total_price' => (float)$this->parseNumericString($data[$totalRowCount - 4][4]),
            'total_discount' => (float)$this->parseNumericString($data[$totalRowCount - 1][1]),
            'balance' => (float)$this->parseNumericString($data[$totalRowCount - 2][1]),
            'net_price' => (float)$this->parseNumericString($data[$totalRowCount - 3][2]),
            'net_price_in_words' => (string)$data[$totalRowCount - 3][0],
            'number_of_items' => (int)$this->parseNumericString($data[$totalRowCount - 1][3]),
        ];

        $numberOfItems = $invoiceData['number_of_items'];
        $invoiceItems = [];

        $start = 6;
        $end = $start + $numberOfItems;
        for ($i = $start; $i < $end; $i++) {
            $itemData = $data[$i];
            $quantity = (int)$this->parseNumericString($itemData[2]);
            $gifted_quantity = (int)$this->parseNumericString($itemData[3]);
            $total_count = $quantity + $gifted_quantity;
            $invoiceItems[] = [
                'collectionName' => (string)$itemData[0],
                'productName' => (string)$itemData[1],
                'quantity' => $quantity,
                'gifted_quantity' => $gifted_quantity,
                'total_count' => $total_count,
                'unit_price' => (float)$this->parseNumericString($itemData[4]),
                'total_price' => (float)$this->parseNumericString($itemData[5]),
                'public_price' => (float)$this->parseNumericString($itemData[6]),
                'discount' => (float)$this->parseNumericString($itemData[7]),
                'description' => (string)$itemData[8] != "0" ? (string)$itemData[8] : null,
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
            'total_price' => ['required', 'numeric'],
            'total_discount' => ['required', 'numeric'],
            'balance' => ['required', 'numeric'],
            'net_price' => ['required', 'numeric'],
            'net_price_in_words' => ['required', 'string'],
            'number_of_items' => ['required', 'numeric'],
            'items' => ['sometimes', 'array'],
            'items.*.collectionName' => ['required', 'string'],
            'items.*.productName' => ['required', 'string'],
            'items.*.quantity' => ['required', 'numeric'],
            'items.*.gifted_quantity' => ['required', 'numeric'],
            'items.*.total_count' => ['required', 'numeric'],
            'items.*.unit_price' => ['required', 'numeric'],
            'items.*.total_price' => ['required', 'numeric'],
            'items.*.public_price' => ['required', 'numeric'],
            'items.*.discount' => ['required', 'numeric'],
            'items.*.description' => ['nullable', 'string'],
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

        $invoice = $this->createOrUpdateInvoiceModel([
            'invoice_id' => $invoiceId,
            'storage_id' => $storage->id,
            'statement' => $invoiceData['statement'],
            'pharmacist' => $invoiceData['pharmacist'],
            'date' => $invoiceData['date'],
            'total_price' => $invoiceData['total_price'],
            'total_discount' => $invoiceData['total_discount'],
            'balance' => $invoiceData['balance'],
            'net_price' => $invoiceData['net_price'],
            'net_price_in_words' => $invoiceData['net_price_in_words'],
            'number_of_items' => $invoiceData['number_of_items'],
        ]);

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
                    'is_important' => null
                ]);
                Log::info("Created missing invoice for storage: $storageId with ID: $id");
            }
        }
    }

    private function createOrUpdateInvoiceModel($data): Invoice
    {
        $invoice = Invoice::where('invoice_id', $data['invoice_id'])
            ->where('storage_id', $data['storage_id'])
            ->first();

        if ($invoice) {
            Log::info("Updating existing invoice ID: {$invoice->invoice_id}");
            $invoice->statement = $data['statement'];
            $invoice->pharmacist = $data['pharmacist'];
            $invoice->date = $data['date'];
            $invoice->total_price = $data['total_price'];
            $invoice->total_discount = $data['total_discount'];
            $invoice->balance = $data['balance'];
            $invoice->net_price = $data['net_price'];
            $invoice->net_price_in_words = $data['net_price_in_words'];
            $invoice->number_of_items = $data['number_of_items'];
            $invoice->status = "Pending";
            $invoice->is_important = true;
            $invoice->save();
        } else {
            Log::info("Creating new invoice ID: {$data['invoice_id']}");
            $invoice = Invoice::create([
                'invoice_id' => $data['invoice_id'],
                'storage_id' => $data['storage_id'],
                'statement' => $data['statement'],
                'pharmacist' => $data['pharmacist'],
                'date' => $data['date'],
                'total_price' => $data['total_price'],
                'total_discount' => $data['total_discount'],
                'balance' => $data['balance'],
                'net_price' => $data['net_price'],
                'net_price_in_words' => $data['net_price_in_words'],
                'number_of_items' => $data['number_of_items'],
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

            // If an invoice item for this product already exists, update it, keep the current count
            if ($existingItemsByProduct->has($product->name)) {
                $quantity = $item['quantity'];
                $gifted_quantity = $item['gifted_quantity'];
                $total_count = $quantity + $gifted_quantity;

                $invoiceItem = $existingItemsByProduct->get($product->name);
                $invoiceItem->description = $item['description'];
                $invoiceItem->quantity = $quantity;
                $invoiceItem->gifted_quantity = $gifted_quantity;
                $invoiceItem->total_count = $total_count;
                $invoiceItem->total_price = $item['total_price'];
                $invoiceItem->public_price = $item['public_price'];
                $invoiceItem->unit_price = $item['unit_price'];
                $invoiceItem->discount = $item['discount'];
                $invoiceItem->save();

                // Remove this item from the collection so that remaining ones are those
                // that are not present in the new request.
                $existingItemsByProduct->forget($product->name);
            } else {
                $invoiceItem = new InvoiceItem([
                    "quantity" => $item['quantity'],
                    "gifted_quantity" => $item['gifted_quantity'],
                    "total_count" => $item['total_count'],
                    "unit_price" => $item['unit_price'],
                    "total_price" => $item['total_price'],
                    "public_price" => $item['public_price'],
                    "discount" => $item['discount'],
                    "description" => $item['description'],
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
