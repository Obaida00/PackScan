<?php

use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PackerController;
use App\Http\Controllers\Api\StorageController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::apiResource('/invoices', InvoiceController::class);
Route::post("/invoices/{id}/done", [InvoiceController::class, 'markInvoiceAsDone']);

Route::get('storages', [StorageController::class, 'index']);
Route::post('storages', [StorageController::class, 'store']);
Route::get('storages/{storage}', [StorageController::class, 'show']);
Route::put('storages/{storage}', [StorageController::class, 'update']);
Route::delete('storages/{storage}', [StorageController::class, 'destroy']);

Route::apiResource('products', ProductController::class);
Route::apiResource('packers', PackerController::class);