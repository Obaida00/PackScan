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
            'net_price' => ['required', 'integer'],
            'storage' => ['required', 'exists:storages,code'],
            'items' => ['sometimes', 'array'],
        ];
    }


    public function messages()
    {
        return [
            'items.*.name.required' => 'Each item must have a name.',
            'items.*.quantity.required' => 'Each item must have a quantity.',
            'items.*.price.required' => 'Each item must have a price.',
            'storage.exists' => 'The storage code must exist in our records.',
        ];
    }
}
