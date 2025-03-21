<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\Packer;
use App\Models\Storage;
use App\Services\InvoiceQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\LaravelPdf\Enums\Unit;

use function Spatie\LaravelPdf\Support\pdf;

class InvoiceController extends Controller
{
    public function generatePdf(string $id)
    {
        $invoice = Invoice::with('invoiceItems.product')->findOrFail($id);

        $pdf = pdf()
            ->margins(10, 2, 40, 2, Unit::Pixel)
            ->format('A5')
            ->headerView('header', ['id' => $invoice->id])
            ->footerView('footer')
            ->view('invoicePdf', ['invoice' => $invoice,])
            ->download("$invoice->id.pdf");
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
        $invoice->done_at = now("+3");
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
        $invoice->sent_at = now("+3");
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
