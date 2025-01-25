<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    // i added the unit_price here cause i cannot guarantee that it is always gonna be the same as the product price + when the process of feeding the product will start i dont want to add the prices for each product, so keep it simple
    protected $fillable = [
        "id",
        "invoice_id",
        "product_id",
        "total_count",
        "unit_price",
        "total_price"
        // "price"
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
