<?php

namespace App\Http\Resources;

use App\Models\InvoiceItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_id' => $this->invoice_id,
            'statement' => $this->statement,
            'pharmacist' => $this->pharmacist,
            'date' => $this->date,
            'storage_name' => $this->storage->name,
            'status' => $this->status,
            'is_important' => $this->is_important,
            'is_missing' => $this->is_missing,
            'total_price' => number_format((int)$this->total_price, 0, '.', ','),
            'total_discount' => number_format((int)$this->total_discount, 0, '.', ','),
            'net_price' => number_format((int)$this->net_price, 0, '.', ','),
            'net_price_in_words' => number_format((int)$this->net_price_in_words, 0, '.', ','),
            'balance' => number_format((int)$this->balance, 0, '.', ','),
            'packer_id' => $this->whenloaded('packer', $this->packer?->id),
            'packer_name' => $this->whenloaded('packer', $this->packer?->name),
            'number_of_packages' => $this->number_of_packages,
            'done_at' => $this->done_at ? Carbon::parse($this->done_at)->format('Y-m-d - H:i:s') : null,
            'sent_at' => $this->sent_at ? Carbon::parse($this->sent_at)->format('Y-m-d - H:i:s') : null,
            'submittion_mode' => $this->submittion_mode,
            'number_of_items' => $this->number_of_items,
            'items' => $this->convertItems($this->invoiceItems),
            'created_at' => $this->created_at->format('Y-m-d - H:i:s')
        ];
    }

    /**
     * @param InvoiceItem[] $items 
     */
    private function convertItems($items)
    {
        $result = [];

        // result should be [productElements, total_count]
        foreach ($items as $item) {
            $result[] = [
                "id" => $item->id,
                "invoice_id" => $item->invoice_id,
                "product_id" => $item->product_id,
                "description" => $item->description,
                "total_count" => $item->total_count,
                "gifted_quantity" => $item->gifted_quantity,
                "current_count" => $item->current_count,
                "total_price" => $item->total_price,
                "public_price" => $item->public_price,
                "unit_price" => $item->unit_price,
                "discount" => $item->discount,
                "barcode" => $item->product->barcode,
                "name" => $item->product->name,
            ];
        }

        return $result;
    }
}
