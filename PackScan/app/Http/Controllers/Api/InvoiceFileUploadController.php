<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InvoiceFileUploadController extends Controller
{
    public function upload(Request $request)
    {
        Log::info('Upload request received', [
            'files' => $request->allFiles(),
            'input' => $request->all()
        ]);

        try {
            if (!$request->hasFile('file')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No file uploaded'
                ], 422);
            }

            $file = $request->file('file');

            $file->storeAs('uploads', "report.xlsx", 'public');

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
