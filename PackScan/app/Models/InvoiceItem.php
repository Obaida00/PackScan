<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Orchid\Filters\Filterable;
use Orchid\Screen\AsSource;

class InvoiceItem extends Model
{
    use HasFactory, HasUuids, AsSource;

    // i added the unit_price here cause i cannot guarantee that it is always gonna be the same as the product price + when the process of feeding the product will start i dont want to add the prices for each product, so keep it simple
    protected $fillable = [
        "invoice_id",
        "product_id",
        "current_count",
        "description",
        "total_count",
        "gifted_quantity",
        "total_price",
        "public_price",
        "unit_price",
        "discount"
    ];


    public $incrementing = false;
    protected $keyType = 'string';

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
