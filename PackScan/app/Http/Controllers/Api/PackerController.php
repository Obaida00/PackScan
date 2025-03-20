<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Packer;
use Illuminate\Http\Request;

class PackerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packers = Packer::all();
        return response()->json($packers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'name' => 'required|string|max:255',
            'can_manually_submit' => 'required|boolean',
            'can_submit_important_invoices' => 'required|boolean',
            'is_invoice_admin' => 'required|boolean'
        ]);

        $packer = Packer::create([
            'id' => $request->id,
            'name' => $request->name,
            'can_manually_submit' => $request->can_manually_submit,
            'can_submit_important_invoices' => $request->can_submit_important_invoices,
            'is_invoice_admin' => $request->is_invoice_admin
        ]);

        return response()->json($packer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $packer = Packer::find($id);

        return response()->json($packer ?? []);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Packer $packer)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'can_manually_submit' => 'required|boolean',
            'can_submit_important_invoices' => 'required|boolean',
            'is_invoice_admin' => 'required|boolean'
        ]);

        $packer->update([
            'name' => $request->name,
            'can_manually_submit' => $request->can_manually_submit,
            'can_submit_important_invoices' => $request->can_submit_important_invoices,
            'is_invoice_admin' => $request->is_invoice_admin
        ]);

        return response()->json($packer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Packer $packer)
    {
        $packer->delete();

        return response()->json(['message' => 'Packer deleted successfully.']);
    }
}
