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
        ]);

        $packer = Packer::create([
            'id' => $request->id,
            'name' => $request->name,
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
        ]);

        $packer->update([
            'name' => $request->name,
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
