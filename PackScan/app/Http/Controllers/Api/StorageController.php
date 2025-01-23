<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStorageRequest;
use App\Http\Requests\UpdateStorageRequest;
use App\Http\Resources\StorageResource;
use App\Models\Storage;

class StorageController extends Controller
{
    /**
     * Display a listing of the storages.
     */
    public function index()
    {
        $storages = Storage::all();
        return StorageResource::collection($storages);
    }

    /**
     * Store a newly created storage in storage.
     */
    public function store(StoreStorageRequest $request)
    {
        $storage = Storage::create($request->validated());
        return response()->json(new StorageResource($storage), 201);
    }

    /**
     * Display the specified storage.
     */
    public function show(Storage $storage)
    {
        return new StorageResource($storage);
    }

    /**
     * Update the specified storage in storage.
     */
    public function update(UpdateStorageRequest $request, Storage $storage)
    {
        $storage->update($request->validated());
        return new StorageResource($storage);
    }

    /**
     * Remove the specified storage from storage.
     */
    public function destroy(Storage $storage)
    {
        $storage->delete();
        return response()->json(null, 204);
    }
}
