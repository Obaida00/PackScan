<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'invoice_id' => ['required', 'integer'],
            'statement' => ['required', 'string'],
            'pharmacist' => ['required', 'string'],
            'date' => ['required', 'string'],
            'total_price' => ['required', 'numeric'],
            'total_discount' => ['required', 'numeric'],
            'balance' => ['required', 'numeric'],            
            'net_price' => ['required', 'numeric'],
            'net_price_in_words' => ['required', 'string'],
            'number_of_items' => ['required', 'numeric'],
            'storage' => ['required', 'exists:storages,code'],
            'items' => ['sometimes', 'array'],
            'items.*.collectionName' => ['required', 'string'],
            'items.*.productName' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer'],
            'items.*.gifted_quantity' => ['required', 'integer'],
            'items.*.unit_price' => ['required', 'numeric'],
            'items.*.total_price' => ['required', 'numeric'],
            'items.*.public_price' => ['required', 'numeric'],
            'items.*.discount' => ['required', 'numeric'],
            'items.*.description' => ['required', 'string'],
        ];
    }
}
