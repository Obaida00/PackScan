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
            'statement' => $this->statement,
            'pharmacist' => $this->pharmacist,
            'date' => $this->date,
            'manager' => $this->manager,
            'storage_name' => $this->storage->name,
            'status' => $this->status,
            'is_important' => $this->is_important,
            'net_price' => number_format((int)$this->net_price, 0, '.', ','),
            'packer_id' => $this->whenloaded('packer', $this->packer?->id),
            'packer_name' => $this->whenloaded('packer', $this->packer?->name),
            'number_of_packages' => $this->number_of_packages,
            'done_at' => $this->done_at ? Carbon::parse($this->done_at)->format('Y-m-d - H:i:s') : null,
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
            $product = $item->product;
            $product['total_count'] = $item['total_count'];
            $product['current_count'] = $item['current_count'];

            $result[] = $product;
        }

        return $result;
    }
}
