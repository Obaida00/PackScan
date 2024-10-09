<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //todo paginate
        return InvoiceResource::collection(Invoice::query()->orderby('created_at', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->toArray();
        // use this to remove the file from the request
        // $data = $request->except(['content']);

        $invoice = Invoice::create($data);

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
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        //todo delete the stored file or move to trash folder
        $invoice->delete();
        return response("", 204);
    }
}
