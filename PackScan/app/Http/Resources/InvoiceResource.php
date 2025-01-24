<?php

namespace App\Http\Resources;

use App\Models\InvoiceItem;
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
            'pharmacist' => $this->pharmacist,
            'manager' => $this->manager,
            'storage_name' => $this->storage->name,
            'status' => $this->status,
            'items' => $this->convertItems($this->invoiceItems),
            'createdAt' => $this->created_at->format('Y-m-d H:i:s')
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
            $product = $item->product;
            $product['total_count'] = $item['total_count'];

            $result[] = $product;
        }

        return $result;
    }
}
