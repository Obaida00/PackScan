<?php

use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PackerController;
use App\Http\Controllers\Api\StorageController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\InvoiceFileUploadController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::apiResource('/invoices', InvoiceController::class)->except('store');
Route::post("/invoices/{id}/done", [InvoiceController::class, 'markInvoiceAsDone']);
Route::post("/invoices/{id}/sent", [InvoiceController::class, 'markInvoiceAsSent']);
Route::post("/invoices/{id}/mark-pending", [InvoiceController::class, 'markInvoicePending']);
Route::post("/invoices/{id}/mark-in-progress", [InvoiceController::class, 'markInvoiceInProgress']);
Route::post("/invoices/{id}/unmark-important", [InvoiceController::class, 'unmarkInvoiceImportant']);
Route::get('/invoices/{id}/receipt', [InvoiceController::class, 'generateReceipt']);
Route::get('/invoices/{id}/sticker', [InvoiceController::class, 'generateSticker']);
Route::post('/invoices/upload', [InvoiceFileUploadController::class, 'upload']);

Route::get('storages', [StorageController::class, 'index']);
Route::post('storages', [StorageController::class, 'store']);
Route::get('storages/{storage}', [StorageController::class, 'show']);
Route::put('storages/{storage}', [StorageController::class, 'update']);
Route::delete('storages/{storage}', [StorageController::class, 'destroy']);

Route::apiResource('products', ProductController::class);
Route::apiResource('packers', PackerController::class);
Route::apiResource('collections', CollectionController::class);
