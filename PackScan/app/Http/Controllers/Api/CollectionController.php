<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $collections = Collection::all();
        return response()->json($collections);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'storage_id' => 'required|string|exists:storages,id'
        ]);

        $collection = Collection::create([
            'name' => $request->name,
            'storage_id' => $request->storage_id,
        ]);

        return response()->json($collection, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $collection = Collection::find($id);

        return response()->json($collection ?? []);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Collection $collection)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'storage_id' => 'required|string|exists:storages,id'
        ]);

        $collection->update([
            'name' => $request->name,
            'storage_id' => $request->storage_id,
        ]);

        return response()->json($collection);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collection $collection)
    {
        $collection->delete();

        return response()->json(['message' => 'Packer deleted successfully.']);
    }
}
