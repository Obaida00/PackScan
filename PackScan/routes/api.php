<?php

use App\Http\Controllers\Api\InvoiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::apiResource('/invoices', InvoiceController::class);
Route::post("/invoices/{id}/done", [InvoiceController::class, 'markInvoiceAsDone']);

// todo storage examples
// Route::put("/New", function () {
//     Storage::put('files/newFile.txt', 'Hello I am txt');
// });
// Route::get("/New", function () {
//     return Storage::download('files/newFile.txt');
//or     return Storage::get('files/newFile.txt');
// });